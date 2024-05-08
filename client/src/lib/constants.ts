import { Icons } from '@/components/Icons';

export const bloodTypes = [
  {
    label: 'A+',
    value: 'a_positive',
  },
  {
    label: 'A-',
    value: 'a_negative',
  },
  {
    label: 'B+',
    value: 'b_positive',
  },
  {
    label: 'B-',
    value: 'b_negative',
  },
  {
    label: 'AB+',
    value: 'ab_positive',
  },
  {
    label: 'AB-',
    value: 'ab_negative',
  },
  {
    label: 'O+',
    value: 'o_positive',
  },
  {
    label: 'O-',
    value: 'o_negative',
  },
];

export const smokingStatus = [
  {
    label: 'Never Smoked',
    value: 'never',
  },
  {
    label: 'Former Smoker',
    value: 'former',
  },
  {
    label: 'Current Smoker',
    value: 'current',
  },
];

export const alcoholStatus = [
  {
    label: 'Never Drank',
    value: 'never',
  },
  {
    label: 'Former Drinker',
    value: 'former',
  },
  {
    label: 'Current Drinker',
    value: 'current',
  },
];

export const drugStatus = [
  {
    label: 'Never Used',
    value: 'never',
  },
  {
    label: 'Former User',
    value: 'former',
  },
  {
    label: 'Current User',
    value: 'current',
  },
];

export const dosageForms = [
  {
    label: 'Tablet',
    value: 'tablet',
    icon: Icons.tablet,
  },
  {
    label: 'Capsule',
    value: 'capsule',
    icon: Icons.capsule,
  },
  {
    label: 'Syrup',
    value: 'syrup',
    icon: Icons.syurp,
  },
  {
    label: 'Injection',
    value: 'injection',
    icon: Icons.injection,
  },
  {
    label: 'Ointment',
    value: 'ointment',
    icon: Icons.ointment,
  },
  {
    label: 'Cream',
    value: 'cream',
    icon: Icons.cream,
  },
  {
    label: 'Lotion',
    value: 'lotion',
    icon: Icons.cream,
  },
  {
    label: 'Inhaler',
    value: 'inhaler',
    icon: Icons.inhaler,
  },
  {
    label: 'Drops',
    value: 'drops',
    icon: Icons.drops,
  },
  {
    label: 'Suppository',
    value: 'suppository',
    icon: Icons.suppository,
  },
  {
    label: 'Patch',
    value: 'patch',
    icon: Icons.patch,
  },
  {
    label: 'Gel',
    value: 'gel',
    icon: Icons.ointment,
  },
  {
    label: 'Spray',
    value: 'spray',
    icon: Icons.spray,
  },
  {
    label: 'Solution',
    value: 'solution',
    icon: Icons.syurp,
  },
  {
    label: 'Powder',
    value: 'powder',
    icon: Icons.powder,
  },
  {
    label: 'Suspension',
    value: 'suspension',
    icon: Icons.syurp,
  },
] as const;

export const routesOfAdministration = [
  {
    label: 'Oral',
    value: 'oral',
  },
  {
    label: 'Sublingual',
    value: 'sublingual',
  },
  {
    label: 'Buccal',
    value: 'buccal',
  },
  {
    label: 'Rectal',
    value: 'rectal',
  },
  {
    label: 'Vaginal',
    value: 'vaginal',
  },
  {
    label: 'Intravenous',
    value: 'intravenous',
  },
  {
    label: 'Intramuscular',
    value: 'intramuscular',
  },
  {
    label: 'Subcutaneous',
    value: 'subcutaneous',
  },
  {
    label: 'Intradermal',
    value: 'intradermal',
  },
  {
    label: 'Transdermal',
    value: 'transdermal',
  },
  {
    label: 'Intrathecal',
    value: 'intrathecal',
  },
  {
    label: 'Intraarticular',
    value: 'intraarticular',
  },
  {
    label: 'Intranasal',
    value: 'intranasal',
  },
  {
    label: 'Inhalation',
    value: 'inhalation',
  },
  {
    label: 'Ocular',
    value: 'ocular',
  },
  {
    label: 'Otic',
    value: 'otic',
  },
  {
    label: 'Topically',
    value: 'topically',
  },
  {
    label: 'Epidural',
    value: 'epidural',
  },
  {
    label: 'Intracardiac',
    value: 'intracardiac',
  },
] as const;
