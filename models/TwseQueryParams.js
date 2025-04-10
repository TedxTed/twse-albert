// models/TwseQueryParams.js
class TwseQueryParams {
  constructor(startDate, endDate) {
    this.startDate = startDate;
    this.endDate = endDate;
  }

  toPostData() {
    return {
      RADIO_CM: "1",
      step: "00",
      TYPEK: "sii",
      CO_MARKET: "17",
      SUBJECT: "自結",
      SDATE: this.startDate,
      EDATE: this.endDate,
      PRO_ITEM: "M99",
      lang: "TW",
    };
  }
}

export default TwseQueryParams;
