// models/TwseQueryParams.js
import dayjs from "dayjs";

class TwseQueryParams {
  constructor(month, year = null) {
    // If year is not provided, use current year
    const targetYear = year || dayjs().year();
    const currentDate = dayjs();
    const targetMonth = dayjs(
      `${targetYear}-${month.toString().padStart(2, "0")}-01`
    );

    // Start from the 1st of the month
    this.startDate = targetMonth.format("YYYYMMDD");

    this.endDate = targetMonth.endOf("month").format("YYYYMMDD");
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
