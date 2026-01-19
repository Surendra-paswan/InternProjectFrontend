// Nepal Address Data
export interface DistrictData {
  [key: string]: string[]; // province -> districts
}

export interface MunicipalityData {
  [key: string]: string[]; // district -> municipalities
}

export const provinces = [
  'Province 1',
  'Madhesh Province',
  'Bagmati Province',
  'Gandaki Province',
  'Lumbini Province',
  'Karnali Province',
  'Sudurpashchim Province'
];

export const districtsByProvince: DistrictData = {
  'Province 1': ['Bhojpur', 'Dhankuta', 'Ilam', 'Jhapa', 'Khotang', 'Morang', 'Okhaldhunga', 'Panchthar', 'Sankhuwasabha', 'Sunsari', 'Taplejung', 'Udayapur'],
  'Madhesh Province': ['Bara', 'Dhanusa', 'Mahottari', 'Parsa', 'Rautahat', 'Saptari', 'Sarlahi'],
  'Bagmati Province': ['Bhaktapur', 'Chitwan', 'Dhading', 'Kathmandu', 'Kavre', 'Lalitpur', 'Makwanpur', 'Nuwakot', 'Ramechhap', 'Rasuwa', 'Sindhuli', 'Sindhupalchowk'],
  'Gandaki Province': ['Baglung', 'Gorkha', 'Gulmi', 'Kaski', 'Lamjung', 'Manang', 'Mustang', 'Myagdi', 'Parbat', 'Syangja', 'Tanahun'],
  'Lumbini Province': ['Argakhanchi', 'Arpa', 'Banke', 'Bardiya', 'Dang', 'Gulmi', 'Kapilvastu', 'Nawalparasi', 'Palpa', 'Rupandehi'],
  'Karnali Province': ['Dailekh', 'Dolpa', 'Humla', 'Jajarkot', 'Jumla', 'Kalikot', 'Mugu', 'Salyan', 'Surkhet', 'Udayapur'],
  'Sudurpashchim Province': ['Achham', 'Baitadi', 'Bajhang', 'Bajura', 'Dadeldhura', 'Doti', 'Kailali', 'Kanchanpur']
};

export const municipalitiesByDistrict: MunicipalityData = {
  'Bhojpur': ['Arun Valley', 'Bhojpur', 'Hatuwagadhi', 'Salpasilichho'],
  'Dhankuta': ['Chaubise', 'Dhankuta', 'Janakpur', 'Suryodaya'],
  'Ilam': ['Antu', 'Deumai', 'Ilam', 'Ridi'],
  'Jhapa': ['Baniyas', 'Gadarwoj', 'Harinagar', 'Ilakaka', 'Jarjan', 'Jhapa', 'Kankai', 'Kamal', 'Kanyam', 'Mechinagar'],
  'Khotang': ['Halesi Tuwachung', 'Khotang', 'Rawa Bhare', 'Sakela'],
  'Morang': ['Batasingha', 'Foksama', 'Kanepokhari', 'Katahari', 'Letang', 'Morang', 'Murthi', 'Rangeli', 'Sunsari', 'Sunwarshi'],
  'Kathmandu': ['Basantapur', 'Budhanilkantha', 'Chankha Narayan', 'Gokarneshwor', 'Kageshwori Manohara', 'Kathmandu', 'Kirtipur', 'Nagarjun', 'Samankhu', 'Shankharapur', 'Tokha', 'Tarakeshwor'],
  'Bhaktapur': ['Bhaktapur', 'Changunarayan', 'Madhyapur Thani', 'Nagarkot', 'Suryabinayak'],
  'Lalitpur': ['Bagdol', 'Godavari', 'Konjyosom', 'Lalitpur', 'Mahabu', 'Namobuddha', 'Panauti', 'Tansen'],
  'Chitwan': ['Bharatpur', 'Bhauwahi', 'Khairahani', 'Chitwan', 'Ichchhakamana', 'Jutpani', 'Kasara', 'Narayani', 'Rapti'],
  'Bara': ['Barbardiya', 'Jitpur Simara', 'Kaluwa', 'Kalaiya', 'Paruwa'],
  'Dhanusa': ['Bideha', 'Dhanusa', 'Janakpur', 'Mithila', 'Mukhiyapatti Musharniya', 'Saharsa'],
  'Mahottari': ['Aaurahi', 'Gaushala', 'Janakpur', 'Mahottari', 'Manara', 'Parsa Gaunpaliha', 'Samsi'],
  'Parsa': ['Bindbasini', 'Jitpur', 'Parsa', 'Pharsatipur', 'Ramnagar', 'Taksar', 'Valmiki'],
  // Add more districts and municipalities as needed for completeness
};

// Default municipalities for all districts not specifically listed
const defaultMunicipalities = ['Municipality 1', 'Municipality 2', 'Municipality 3', 'Municipality 4'];

export const getMunicipalitiesForDistrict = (district: string): string[] => {
  return municipalitiesByDistrict[district] || defaultMunicipalities;
};

export const getDistrictsForProvince = (province: string): string[] => {
  return districtsByProvince[province] || [];
};
