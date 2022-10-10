const overlay = document.querySelector(".overlay");
const errorModal = document.querySelector(".overlay__modal");
const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
const [ipAddress, ipLocation, ipTimezone, ipIsp] =
  document.querySelectorAll(".search-info");

const address = (key) => {
  return `https://geo.ipify.org/api/v2/country,city?apiKey=at_xLwfFGk4DuGsbVHqiUyExFf7UwUWi&ipAddress=${key}`;
};

// set default map
try {
  var map = L.map("map").setView([0, 0], 5);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
} catch (error) {
  console.log(error.response);
}

// create custom map marker
const myIcon = L.icon({
  iconUrl: "images/icon-location.svg",
  iconSize: [46, 56],
  iconAnchor: [22, 94],
  popupAnchor: [-3, -76],
});

// for US territories
const USAbbr = {
  ALABAMA: "AL",
  ALASKA: "AK",
  "AMERICAN SAMOA": "AS",
  ARIZONA: "AZ",
  ARKANSAS: "AR",
  CALIFORNIA: "CA",
  COLORADO: "CO",
  CONNECTICUT: "CT",
  DELAWARE: "DE",
  "DISTRICT OF COLUMBIA": "DC",
  "FEDERATED STATES OF MICRONESIA": "FM",
  FLORIDA: "FL",
  GEORGIA: "GA",
  GUAM: "GU",
  HAWAII: "HI",
  IDAHO: "ID",
  ILLINOIS: "IL",
  INDIANA: "IN",
  IOWA: "IA",
  KANSAS: "KS",
  KENTUCKY: "KY",
  LOUISIANA: "LA",
  MAINE: "ME",
  "MARSHALL ISLANDS": "MH",
  MARYLAND: "MD",
  MASSACHUSETTS: "MA",
  MICHIGAN: "MI",
  MINNESOTA: "MN",
  MISSISSIPPI: "MS",
  MISSOURI: "MO",
  MONTANA: "MT",
  NEBRASKA: "NE",
  NEVADA: "NV",
  "NEW HAMPSHIRE": "NH",
  "NEW JERSEY": "NJ",
  "NEW MEXICO": "NM",
  "NEW YORK": "NY",
  "NORTH CAROLINA": "NC",
  "NORTH DAKOTA": "ND",
  "NORTHERN MARIANA ISLANDS": "MP",
  OHIO: "OH",
  OKLAHOMA: "OK",
  OREGON: "OR",
  PALAU: "PW",
  PENNSYLVANIA: "PA",
  "PUERTO RICO": "PR",
  "RHODE ISLAND": "RI",
  "SOUTH CAROLINA": "SC",
  "SOUTH DAKOTA": "SD",
  TENNESSEE: "TN",
  TEXAS: "TX",
  UTAH: "UT",
  VERMONT: "VT",
  "VIRGIN ISLANDS": "VI",
  VIRGINIA: "VA",
  WASHINGTON: "WA",
  "WEST VIRGINIA": "WV",
  WISCONSIN: "WI",
  WYOMING: "WY",
};

searchBtn.addEventListener("click", () => {
  const apiKey = searchInput.value;
  apiRequest(apiKey);
});

const apiRequest = async (key) => {
  try {
    if (key.length === 0) throw "empty";
    const res = await axios.get(address(key));
    const data = res.data;

    if (data.location.country === "US") {
      ipLocation.innerText = `${data.location.city || "N/A"}, ${
        USAbbr[data.location.region.toUpperCase()] || "N/A"
      }, ${data.location.country || "N/A"}.`;
    } else {
      ipLocation.innerText = `${data.location.city || "N/A"}, ${
        data.location.region || "N/A"
      }, ${data.location.country || "N/A"}.`;
    }

    ipTimezone.innerText = `UTC${data.location.timezone}`;
    ipAddress.innerText = data.ip;
    ipIsp.innerText = data.isp;

    updateMap(data.location.lat, data.location.lng);
  } catch (error) {
    const codeEmpty = "IP cannot be empty";
    const code4 = "Enterd invalid IP address";
    const code5 =
      "Failed to load data server. Check your internet connection and try again.";
    if (error == "empty") setErrorMessage(codeEmpty);
    else if (Math.floor(error.response.data.code / 100) === 4)
      setErrorMessage(code4);
    else if (Math.floor(error.response.data.code / 100) === 5)
      setErrorMessage(code5);
    else setErrorMessage(error.response.data.messages);
    overlay.classList.add("active");
  }
};

function updateMap(lat, lng) {
  try {
    map.setView([lat + 0.1, lng], 10);
    L.marker([lat, lng], { icon: myIcon }).addTo(map);
  } catch (e) {
    setErrorMessage(e);
    overlay.classList.add("active");
    function onLocationError(e) {
      alert(e.response);
    }
    map.on("locationerror", onLocationError);
  }
}

errorModal.addEventListener("submit", (e) => {
  e.preventDefault();
  searchInput.value = "";

  ipTimezone.innerText = `UTC-00:00`;
  ipAddress.innerText = "N/A";
  ipIsp.innerText = "N/A";
  ipLocation.innerText = "USA";
  overlay.classList.remove("active");
});

function setErrorMessage(msg) {
  const err = document.querySelector("#error-msg");
  err.innerText = msg;
}
