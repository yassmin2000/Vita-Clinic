export const data = [
  {
    id: 1,
    name: 'Complete Blood Count (CBC)',
    description:
      'A comprehensive blood test to evaluate overall health and detect a wide range of disorders, including anemia, infection, and leukemia.',
    price: 50.0,
    biomarkers: [
      { id: 1, name: 'White Blood Cells (WBCs)' },
      { id: 2, name: 'Red Blood Cells (RBCs)' },
      { id: 3, name: 'Hemoglobin (Hb)' },
      { id: 4, name: 'Platelets' },
      { id: 5, name: 'Absolute Neutrophil Count (ANC)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 2,
    name: 'Coagulation Panel',
    description:
      "A group of tests to assess the blood's ability to clot properly, which is crucial for preventing excessive bleeding.",
    price: 75.0,
    biomarkers: [
      { id: 6, name: 'Prothrombin Time (PT)' },
      { id: 7, name: 'Activated Partial Thromboplastin Time (aPTT)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 3,
    name: 'Liver Function Tests (LFTs)',
    description:
      "A series of blood tests that assess the liver's health and function, helping to diagnose liver diseases and monitor treatment.",
    price: 60.0,
    biomarkers: [
      { id: 8, name: 'Alanine Aminotransferase (ALT)' },
      { id: 9, name: 'Aspartate Aminotransferase (AST)' },
      { id: 10, name: 'Bilirubin' },
      { id: 11, name: 'Albumin' },
      { id: 12, name: 'Total Protein' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 4,
    name: 'Renal Function Panel',
    description:
      'A set of tests to evaluate kidney function and detect conditions such as kidney disease, dehydration, and electrolyte imbalances.',
    price: 65.0,
    biomarkers: [
      { id: 13, name: 'Blood Urea Nitrogen (BUN)' },
      { id: 14, name: 'Creatinine' },
      { id: 15, name: 'Sodium' },
      { id: 16, name: 'Potassium' },
      { id: 17, name: 'Phosphate' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 5,
    name: 'Inflammatory Markers Panel',
    description:
      'A group of tests that measure various substances in the blood to assess inflammation levels, which can indicate infection, autoimmune disorders, or cancer.',
    price: 70.0,
    biomarkers: [
      { id: 18, name: 'C-Reactive Protein (CRP)' },
      { id: 19, name: 'Lactate Dehydrogenase (LDH)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 6,
    name: 'Thyroid Function Panel',
    description:
      'A set of tests to evaluate thyroid gland function and diagnose thyroid disorders such as hypothyroidism and hyperthyroidism.',
    price: 55.0,
    biomarkers: [
      { id: 20, name: 'Thyroid Stimulating Hormone (TSH)' },
      { id: 21, name: 'Free Thyroxine (FT4)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 7,
    name: 'Comprehensive Metabolic Panel (CMP)',
    description:
      'A group of tests that assess various aspects of metabolic function, including liver and kidney function, electrolyte levels, and blood glucose.',
    price: 80.0,
    biomarkers: [
      { id: 22, name: 'Calcium' },
      { id: 23, name: 'Magnesium' },
      { id: 24, name: 'Total Bilirubin' },
      { id: 25, name: 'Glucose' },
      { id: 26, name: 'Globulin' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 8,
    name: 'Tumor Markers Panel',
    description:
      'A set of tests that measure specific substances in the blood associated with certain types of cancer, aiding in diagnosis, monitoring, and treatment response assessment.',
    price: 90.0,
    biomarkers: [
      { id: 27, name: 'Alpha-fetoprotein (AFP)' },
      { id: 28, name: 'Carcinoembryonic Antigen (CEA)' },
      { id: 29, name: 'Prostate-specific Antigen (PSA)' },
      { id: 30, name: 'CA-125' },
      { id: 31, name: 'CA 19-9' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 9,
    name: 'Peripheral Blood Smear',
    description:
      'A microscopic examination of blood cells to evaluate their size, shape, and maturity, aiding in the diagnosis of various blood disorders, including leukemia and anemia.',
    price: 55.0,
    biomarkers: [
      { id: 1, name: 'White Blood Cells (WBCs)' },
      { id: 2, name: 'Red Blood Cells (RBCs)' },
      { id: 4, name: 'Platelets' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 10,
    name: 'Bone Marrow Aspiration and Biopsy',
    description:
      'A procedure to collect and examine bone marrow tissue, helping to diagnose blood disorders, such as leukemia and lymphoma, and assess disease progression.',
    price: 200.0,
    biomarkers: [
      { id: 1, name: 'White Blood Cells (WBCs)' },
      { id: 2, name: 'Red Blood Cells (RBCs)' },
      { id: 3, name: 'Hemoglobin (Hb)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 11,
    name: 'Flow Cytometry',
    description:
      'A technique that analyzes the characteristics of individual cells in a sample, aiding in the diagnosis and classification of leukemia, lymphoma, and other blood disorders.',
    price: 150.0,
    biomarkers: [
      { id: 1, name: 'White Blood Cells (WBCs)' },
      { id: 5, name: 'Absolute Neutrophil Count (ANC)' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 12,
    name: 'Genetic Testing',
    description:
      'A variety of tests that analyze DNA, RNA, and chromosomes to identify genetic mutations associated with an increased risk of cancer, guiding personalized treatment decisions.',
    price: 250.0,
    biomarkers: [
      { id: 32, name: 'BRCA1 Gene Mutation' },
      { id: 33, name: 'BRCA2 Gene Mutation' },
      { id: 34, name: 'HER2 Gene Amplification' },
    ],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 13,
    name: 'Bone Scan',
    description:
      'A nuclear imaging test used to diagnose bone disorders, such as bone metastases, by detecting radioactive tracers injected into the bloodstream.',
    price: 300.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 14,
    name: 'PET-CT Scan',
    description:
      'A combined imaging technique that uses positron emission tomography (PET) and computed tomography (CT) to visualize metabolic activity and anatomy, aiding in cancer diagnosis, staging, and treatment monitoring.',
    price: 800.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 15,
    name: 'MRI (Magnetic Resonance Imaging)',
    description:
      "A non-invasive imaging technique that uses strong magnetic fields and radio waves to produce detailed images of the body's internal structures, helping to detect and monitor cancer and its effects on surrounding tissues.",
    price: 700.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 16,
    name: 'CT (Computed Tomography) Scan',
    description:
      'A diagnostic imaging test that uses X-rays and computer technology to create cross-sectional images of the body, enabling the detection and evaluation of tumors, metastases, and other abnormalities.',
    price: 600.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 17,
    name: 'Ultrasound',
    description:
      'An imaging test that uses high-frequency sound waves to produce real-time images of internal organs and tissues, assisting in the detection and diagnosis of tumors, fluid accumulation, and other abnormalities.',
    price: 400.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 18,
    name: 'Fine Needle Aspiration (FNA)',
    description:
      'A minimally invasive procedure that uses a thin needle to extract cells or tissue samples from suspicious areas, aiding in the diagnosis of tumors and guiding treatment decisions.',
    price: 250.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 19,
    name: 'Biopsy',
    description:
      'A procedure to remove a small sample of tissue for examination under a microscope, helping to diagnose cancer, determine its type and stage, and guide treatment planning.',
    price: 300.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 20,
    name: 'Molecular Profiling',
    description:
      'A comprehensive analysis of tumor DNA, RNA, and proteins to identify specific genetic alterations and molecular pathways driving cancer growth, guiding targeted therapy selection and personalized treatment approaches.',
    price: 1000.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 21,
    name: 'Immunohistochemistry (IHC)',
    description:
      'A laboratory technique that uses antibodies to detect specific proteins in tissue samples, aiding in the diagnosis and classification of cancer and predicting response to targeted therapies.',
    price: 350.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
  {
    id: 22,
    name: 'Liquid Biopsy',
    description:
      'A non-invasive test that analyzes circulating tumor DNA (ctDNA) and other biomarkers in blood samples to detect and monitor cancer, assess treatment response, and detect resistance mutations.',
    price: 500.0,
    biomarkers: [],
    createdAt: '2024-03-19T00:00:00Z',
  },
];
