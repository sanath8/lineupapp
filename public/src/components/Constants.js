const Constants = () => {
  const url = "http://localhost:3000/services"
  return {
    url,
    login: `${url}/login`,

    getConversation: `${url}/getconversation/{id}`,
    getRooms: `${url}/getrooms/{id}`,
    saveReadStatus: `${url}/updateroomreadstatus`,

    header: { "Content-Type": "application/json" },

    method: {
      POST: "POST",
      GET: "GET",
      PUT: "PUT",
    },

    formatDates: (dateReceived) => {
      const theWeek = makeFormattedWeek()
      if (theWeek[dateReceived.substring(0, dateReceived.indexOf("T"))]) {
        let formattedDate =
          theWeek[dateReceived.substring(0, dateReceived.indexOf("T"))]
        return formattedDate == "Today"
          ? dateReceived.substr(dateReceived.indexOf("T") + 1, 5)
          : formattedDate
      } else {
        return `${new Date(dateReceived).getDate()}/${
          new Date(dateReceived).getMonth() + 1
        }/${new Date(dateReceived).getFullYear()}`
      }
    },
  }
}

function makeFormattedWeek() {
  const theWeek = {}

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]

  for (let i = 0; i < 7; i++) {
    let today = new Date()

    let prevDate = today.setDate(today.getDate() - i)

    let prevDateStr = new Date(prevDate).toISOString()
    prevDateStr = prevDateStr.substring(0, prevDateStr.indexOf("T"))

    
    theWeek[prevDateStr] = i == 0 ? "Today" : days[new Date(prevDate).getDay()]
  }
  return theWeek
}

export default Constants
