const tinh = [
  {
    id: "68",
    name: "Tỉnh Lâm Đồng",
  },
  {
    id: "08",
    name: "Tỉnh Tuyên Quang",
  },
  {
    id: "91",
    name: "Tỉnh Kiên Giang",
  },
  {
    id: "80",
    name: "Tỉnh Long An",
  },
  {
    id: "84",
    name: "Tỉnh Trà Vinh",
  },
  {
    id: "74",
    name: "Tỉnh Bình Dương",
  },
  {
    id: "51",
    name: "Tỉnh Quảng Ngãi",
  },
  {
    id: "10",
    name: "Tỉnh Lào Cai",
  },
  {
    id: "40",
    name: "Tỉnh Nghệ An",
  },
  {
    id: "54",
    name: "Tỉnh Phú Yên",
  },
  {
    id: "58",
    name: "Tỉnh Ninh Thuận",
  },
  {
    id: "17",
    name: "Tỉnh Hoà Bình",
  },
  {
    id: "35",
    name: "Tỉnh Hà Nam",
  },
  {
    id: "72",
    name: "Tỉnh Tây Ninh",
  },
  {
    id: "24",
    name: "Tỉnh Bắc Giang",
  },
  {
    id: "66",
    name: "Tỉnh Đắk Lắk",
  },
  {
    id: "04",
    name: "Tỉnh Cao Bằng",
  },
  {
    id: "30",
    name: "Tỉnh Hải Dương",
  },
  {
    id: "06",
    name: "Tỉnh Bắc Kạn",
  },
  {
    id: "01",
    name: "Thành phố Hà Nội",
  },
  {
    id: "45",
    name: "Tỉnh Quảng Trị",
  },
  {
    id: "31",
    name: "Thành phố Hải Phòng",
  },
  {
    id: "25",
    name: "Tỉnh Phú Thọ",
  },
  {
    id: "20",
    name: "Tỉnh Lạng Sơn",
  },
  {
    id: "94",
    name: "Tỉnh Sóc Trăng",
  },
  {
    id: "62",
    name: "Tỉnh Kon Tum",
  },
  {
    id: "49",
    name: "Tỉnh Quảng Nam",
  },
  {
    id: "92",
    name: "Thành phố Cần Thơ",
  },
  {
    id: "48",
    name: "Thành phố Đà Nẵng",
  },
  {
    id: "26",
    name: "Tỉnh Vĩnh Phúc",
  },
  {
    id: "19",
    name: "Tỉnh Thái Nguyên",
  },
  {
    id: "15",
    name: "Tỉnh Yên Bái",
  },
  {
    id: "22",
    name: "Tỉnh Quảng Ninh",
  },
  {
    id: "52",
    name: "Tỉnh Bình Định",
  },
  {
    id: "02",
    name: "Tỉnh Hà Giang",
  },
  {
    id: "86",
    name: "Tỉnh Vĩnh Long",
  },
  {
    id: "34",
    name: "Tỉnh Thái Bình",
  },
  {
    id: "44",
    name: "Tỉnh Quảng Bình",
  },
  {
    id: "64",
    name: "Tỉnh Gia Lai",
  },
  {
    id: "87",
    name: "Tỉnh Đồng Tháp",
  },
  {
    id: "14",
    name: "Tỉnh Sơn La",
  },
  {
    id: "89",
    name: "Tỉnh An Giang",
  },
  {
    id: "95",
    name: "Tỉnh Bạc Liêu",
  },
  {
    id: "77",
    name: "Tỉnh Bà Rịa - Vũng Tàu",
  },
  {
    id: "96",
    name: "Tỉnh Cà Mau",
  },
  {
    id: "75",
    name: "Tỉnh Đồng Nai",
  },
  {
    id: "82",
    name: "Tỉnh Tiền Giang",
  },
  {
    id: "46",
    name: "Tỉnh Thừa Thiên Huế",
  },
  {
    id: "56",
    name: "Tỉnh Khánh Hòa",
  },
  {
    id: "42",
    name: "Tỉnh Hà Tĩnh",
  },
  {
    id: "70",
    name: "Tỉnh Bình Phước",
  },
  {
    id: "38",
    name: "Tỉnh Thanh Hóa",
  },
  {
    id: "37",
    name: "Tỉnh Ninh Bình",
  },
  {
    id: "83",
    name: "Tỉnh Bến Tre",
  },
  {
    id: "60",
    name: "Tỉnh Bình Thuận",
  },
  {
    id: "11",
    name: "Tỉnh Điện Biên",
  },
  {
    id: "27",
    name: "Tỉnh Bắc Ninh",
  },
  {
    id: "79",
    name: "Thành phố Hồ Chí Minh",
  },
  {
    id: "36",
    name: "Tỉnh Nam Định",
  },
  {
    id: "93",
    name: "Tỉnh Hậu Giang",
  },
  {
    id: "33",
    name: "Tỉnh Hưng Yên",
  },
  {
    id: "67",
    name: "Tỉnh Đắk Nông",
  },
  {
    id: "12",
    name: "Tỉnh Lai Châu",
  },
];

module.exports.tinh = tinh

module.exports.getNameTinh = (id) =>{
  return tinh.find((val) => val.id == id).name;
}