import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const db = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const adminPassword = await hash("admin123!", 12);
  const admin = await db.user.upsert({
    where: { email: "admin@nie-danmark.dk" },
    update: {},
    create: {
      email: "admin@nie-danmark.dk",
      name: "NIE Danmark Admin",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // Create test customer
  const customerPassword = await hash("kunde123!", 12);
  const customer = await db.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test Kunde",
      password: customerPassword,
      role: "CUSTOMER",
      emailVerified: new Date(),
    },
  });

  // Create test application
  const application = await db.application.upsert({
    where: { id: "test-application-1" },
    update: {},
    create: {
      id: "test-application-1",
      userId: customer.id,
      status: "PROCESSING",
      fullName: "Test Kunde",
      email: "test@example.com",
      phone: "+4512345678",
      dateOfBirth: new Date("1985-06-15"),
      passportNumber: "DK12345678",
      address: "Testvej 1",
      city: "Aarhus",
      postalCode: "8000",
      country: "Danmark",
      paymentStatus: "PAID",
      amount: 210,
      currency: "EUR",
    },
  });

  await db.statusHistory.create({
    data: {
      applicationId: application.id,
      status: "RECEIVED",
      note: "Ansøgning modtaget",
      changedBy: admin.id,
    },
  });

  await db.statusHistory.create({
    data: {
      applicationId: application.id,
      status: "PROCESSING",
      note: "Dokumenter kontrolleret og godkendt. Sagen er nu under behandling.",
      changedBy: admin.id,
    },
  });

  // ── EX-18 form template & version ────────────────────────────────
  const ex18Template = await db.formTemplate.upsert({
    where: { type: "EX-18" },
    update: {},
    create: {
      type: "EX-18",
      name: "EX-18 Ansøgningsformular",
      description:
        "Solicitud de NIE / Solicitud de Certificado de Registro de Ciudadano de la Unión — den officielle spanske ansøgningsformular for NIE-numre.",
      active: true,
    },
  });

  await db.formVersion.upsert({
    where: { templateId_version: { templateId: ex18Template.id, version: "1.0" } },
    update: {},
    create: {
      templateId: ex18Template.id,
      version: "1.0",
      active: true,
      fieldMapping: {
        fullName: "Fulde navn som anført i pas (felt 1-2 på EX-18)",
        dateOfBirth: "Fødselsdato (dd/mm/åååå)",
        passportNumber: "Pas- eller ID-nummer",
        country: "Statsborgerskab / oprindelsesland",
        address: "Adresse i hjemland eller Spanien",
        city: "By",
        postalCode: "Postnummer",
        email: "Kontakt-e-mail",
        phone: "Kontakttelefonnummer",
      },
    },
  });

  // ── Team members ─────────────────────────────────────────────────
  await db.teamMember.upsert({
    where: { id: "team-lawyer-1" },
    update: {},
    create: {
      id: "team-lawyer-1",
      name: "Carlos Jiménez Ortega",
      title: "Spansk advokat (Abogado)",
      role: "LAWYER",
      bio: "Carlos har over 15 års erfaring med udlændingeret og bistår vores kunder med juridisk rådgivning gennem hele NIE-processen — fra første ansøgning til opfølgning hos myndighederne.",
      certifications: ["Beskikket advokat (Colegio de Abogados)", "Specialist i udlændingeret", "Spansk og engelsk"],
      email: "carlos@nie-danmark.dk",
      phone: "+34 600 123 456",
      order: 0,
      active: true,
    },
  });

  await db.teamMember.upsert({
    where: { id: "team-notary-1" },
    update: {},
    create: {
      id: "team-notary-1",
      name: "Isabel Moreno Vidal",
      title: "Notar (Notaria)",
      role: "NOTARY",
      bio: "Isabel sikrer, at alle dokumenter i din ansøgning bliver korrekt bekræftet og noteret efter spansk lovgivning, så din sag kan behandles uden forsinkelser.",
      certifications: ["Statsautoriseret notar", "Medlem af Consejo General del Notariado"],
      email: "isabel@nie-danmark.dk",
      phone: "+34 600 234 567",
      order: 1,
      active: true,
    },
  });

  await db.teamMember.upsert({
    where: { id: "team-advisor-1" },
    update: {},
    create: {
      id: "team-advisor-1",
      name: "Mette Lindgaard",
      title: "Kunderådgiver",
      role: "ADVISOR",
      bio: "Mette er dansk og din primære kontaktperson hos NIE Danmark. Hun guider dig på dansk gennem hele forløbet og sørger for, at du altid ved, hvad der sker i din sag.",
      certifications: ["Dansk og spansk", "10+ års erfaring med kundeservice"],
      email: "mette@nie-danmark.dk",
      phone: "+45 70 20 30 40",
      order: 2,
      active: true,
    },
  });

  // ── Customer reviews ─────────────────────────────────────────────
  const reviewSeeds = [
    {
      id: "review-1",
      authorName: "Anders Holm",
      rating: 5,
      content: "Super nem proces — jeg slap for at stå i kø hos myndighederne i Spanien. Fik mit NIE-nummer hurtigere end jeg havde turdet håbe på.",
      source: "trustpilot",
      featured: true,
      daysAgo: 12,
    },
    {
      id: "review-2",
      authorName: "Camilla Skov Pedersen",
      rating: 5,
      content: "Fantastisk service fra start til slut. Jeg fik svar på alle mine spørgsmål på dansk, og dokumenterne var klar præcis som lovet.",
      source: "trustpilot",
      featured: true,
      daysAgo: 28,
    },
    {
      id: "review-3",
      authorName: "Jesper Bach Nielsen",
      rating: 4,
      content: "God og professionel hjælp. Det tog lidt længere tid end forventet pga. ferie i Spanien, men teamet holdt mig opdateret undervejs.",
      source: "google",
      featured: false,
      daysAgo: 45,
    },
    {
      id: "review-4",
      authorName: "Louise Krogh",
      rating: 5,
      content: "Kan varmt anbefales! Jeg var nervøs for det administrative bøvl, men NIE Danmark klarede det hele for mig — helt uden stress.",
      source: "trustpilot",
      featured: true,
      daysAgo: 60,
    },
    {
      id: "review-5",
      authorName: "Thomas Vestergaard",
      rating: 5,
      content: "Hurtig respons og tydelig kommunikation. Jeg vidste altid, hvor i processen min sag var. Pengene værd for at spare tid og bøvl.",
      source: "internal",
      featured: false,
      daysAgo: 80,
    },
    {
      id: "review-6",
      authorName: "Maria Søndergaard",
      rating: 4,
      content: "Rigtig god oplevelse. Det eneste minus var, at jeg selv skulle huske at sende et par ekstra dokumenter — men support var hurtig til at hjælpe.",
      source: "google",
      featured: false,
      daysAgo: 95,
    },
    {
      id: "review-7",
      authorName: "Rasmus Friis",
      rating: 5,
      content: "Brugte NIE Danmark i forbindelse med køb af lejlighed i Alicante. Alt blev klaret professionelt, og jeg fik mit NIE-nummer i god tid inden overtagelsen.",
      source: "trustpilot",
      featured: true,
      daysAgo: 110,
    },
  ];

  for (const r of reviewSeeds) {
    const { id, daysAgo, ...data } = r;
    await db.review.upsert({
      where: { id },
      update: {},
      create: {
        id,
        ...data,
        publishedAt: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log("Database seeded successfully!");
  console.log(`Admin: admin@nie-danmark.dk / admin123!`);
  console.log(`Kunde: test@example.com / kunde123!`);
}

main()
  .catch(console.error)
  .finally(async () => await db.$disconnect());
