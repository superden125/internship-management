const tinh = [{
    id: "68",
    name: "Lâm Đồng",
  },
  {
    id: "08",
    name: "Tuyên Quang",
  },
  {
    id: "91",
    name: "Kiên Giang",
  },
  {
    id: "80",
    name: "Long An",
  },
  {
    id: "84",
    name: "Trà Vinh",
  },
  {
    id: "74",
    name: "Bình Dương",
  },
  {
    id: "51",
    name: "Quảng Ngãi",
  },
  {
    id: "10",
    name: "Lào Cai",
  },
  {
    id: "40",
    name: "Nghệ An",
  },
  {
    id: "54",
    name: "Phú Yên",
  },
  {
    id: "58",
    name: "Ninh Thuận",
  },
  {
    id: "17",
    name: "Hoà Bình",
  },
  {
    id: "35",
    name: "Hà Nam",
  },
  {
    id: "72",
    name: "Tây Ninh",
  },
  {
    id: "24",
    name: "Bắc Giang",
  },
  {
    id: "66",
    name: "Đắk Lắk",
  },
  {
    id: "04",
    name: "Cao Bằng",
  },
  {
    id: "30",
    name: "Hải Dương",
  },
  {
    id: "06",
    name: "Bắc Kạn",
  },
  {
    id: "01",
    name: "Hà Nội",
  },
  {
    id: "45",
    name: "Quảng Trị",
  },
  {
    id: "31",
    name: "Hải Phòng",
  },
  {
    id: "25",
    name: "Phú Thọ",
  },
  {
    id: "20",
    name: "Lạng Sơn",
  },
  {
    id: "94",
    name: "Sóc Trăng",
  },
  {
    id: "62",
    name: "Kon Tum",
  },
  {
    id: "49",
    name: "Quảng Nam",
  },
  {
    id: "92",
    name: "Cần Thơ",
  },
  {
    id: "48",
    name: "Đà Nẵng",
  },
  {
    id: "26",
    name: "Vĩnh Phúc",
  },
  {
    id: "19",
    name: "Thái Nguyên",
  },
  {
    id: "15",
    name: "Yên Bái",
  },
  {
    id: "22",
    name: "Quảng Ninh",
  },
  {
    id: "52",
    name: "Bình Định",
  },
  {
    id: "02",
    name: "Hà Giang",
  },
  {
    id: "86",
    name: "Vĩnh Long",
  },
  {
    id: "34",
    name: "Thái Bình",
  },
  {
    id: "44",
    name: "Quảng Bình",
  },
  {
    id: "64",
    name: "Gia Lai",
  },
  {
    id: "87",
    name: "Đồng Tháp",
  },
  {
    id: "14",
    name: "Sơn La",
  },
  {
    id: "89",
    name: "An Giang",
  },
  {
    id: "95",
    name: "Bạc Liêu",
  },
  {
    id: "77",
    name: "Bà Rịa - Vũng Tàu",
  },
  {
    id: "96",
    name: "Cà Mau",
  },
  {
    id: "75",
    name: "Đồng Nai",
  },
  {
    id: "82",
    name: "Tiền Giang",
  },
  {
    id: "46",
    name: "Thừa Thiên Huế",
  },
  {
    id: "56",
    name: "Khánh Hòa",
  },
  {
    id: "42",
    name: "Hà Tĩnh",
  },
  {
    id: "70",
    name: "Bình Phước",
  },
  {
    id: "38",
    name: "Thanh Hóa",
  },
  {
    id: "37",
    name: "Ninh Bình",
  },
  {
    id: "83",
    name: "Bến Tre",
  },
  {
    id: "60",
    name: "Bình Thuận",
  },
  {
    id: "11",
    name: "Điện Biên",
  },
  {
    id: "27",
    name: "Bắc Ninh",
  },
  {
    id: "79",
    name: "Hồ Chí Minh",
  },
  {
    id: "36",
    name: "Nam Định",
  },
  {
    id: "93",
    name: "Hậu Giang",
  },
  {
    id: "33",
    name: "Hưng Yên",
  },
  {
    id: "67",
    name: "Đắk Nông",
  },
  {
    id: "12",
    name: "Lai Châu",
  },
];

module.exports.tinh = tinh

module.exports.getNameTinh = (id) => {
  return tinh.find((val) => val.id == id).name;
}