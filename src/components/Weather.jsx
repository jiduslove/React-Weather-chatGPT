import { useEffect, useState } from "react";
import {
  FaSun,
  FaCloudSun,
  FaCloud,
  FaCloudMeatball,
  FaCloudSunRain,
  FaCloudShowersHeavy,
  FaPooStorm,
  FaSnowflake,
  FaSmog,
} from "react-icons/fa";
import axios from "axios";

const weatherIcon = {
  "01": <FaSun size={96} />,
  "02": <FaCloudSun size={96} />,
  "03": <FaCloud size={96} />,
  "04": <FaCloudMeatball size={96} />,
  "09": <FaCloudSunRain size={96} />,
  10: <FaCloudShowersHeavy size={96} />,
  11: <FaPooStorm size={96} />,
  13: <FaSnowflake size={96} />,
  50: <FaSmog size={96} />,
}; //react icons 사이트에서 component를 해서 해당 파일들을 가져오도록 함.
//파일 하나하나가 component 이고, 상수(변하지 않는 값)여서 밖에 따로 작성함.

function Weather() {
  const [lat, setLat] = useState();
  const [lon, setLon] = useState();
  const [weatherInfo, setWeatherInfo] = useState();

  const getGeolocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLon(position.coords.longitude);
      }, //실행이 되면 윗부분을 처리하고(위치정보에 대한 동의를 해주면 위에 해당 코드를 실행하고)
      () => {
        alert("위치 정보에 동의 해주셔야 합니다.");
      } //실행이 안되면 현재위치에 있는 정보를 처리한다.(위치정보 동의를 해주지 않으면 위에 동의해줘야한다는 text창을 노출시키도록 한다.)
    );
  }; //위치정보 가져오는 코드작성.
  const getWeatherInfo = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_WEATHER_API}&units=metric`
      ); // process.env.REACT_APP_WEATHER_API 는 환경변수. 배포를 하기전에 사용자들이 접속하게 되면 외부로 노출되게 됨. 그 노출을 막기위해 필요. (.env 파일을 만들고 그안에 코드를 넣어줘야 사용할 수있음.)

      if (response.status !== 200) {
        alert("날씨 정보를 가져오지 못했습니다.");

        return;
      }

      console.log(response.data);
      setWeatherInfo(response.data); //정상적으로 작동이 되면 try문이 작동을 하고
    } catch (error) {
      console.error(error); //작동이 되지 않으면 catch문이 작동되도록 한다.
    } //useEffect 안에서 비동기함수를 사용하기 위해서는 코드를 만들어야 비동기함수를 사용할 수 있음.
  };

  useEffect(() => {
    getGeolocation();
  }, []);
  useEffect(() => {
    //lat,lon가 업데이트 될때마다 실행된다.
    if (!lat || !lon) return; //lat가 없거나 lon가 없다면 실행을 멈춰라.(함수를 리턴하도록 함.)

    getWeatherInfo();
  }, [lat, lon]);
  useEffect(() => console.log(lat), [lat]);
  useEffect(() => console.log(lon), [lon]);
  useEffect(() => console.log(process.env.REACT_APP_WEATHER_API), []);

  return (
    <div className="bg-red-100 min-h-screen flex justify-center items-center">
      {weatherInfo ? (
        <div className="flex flex-col justify-center items-center">
          {weatherIcon[weatherInfo.weather[0].icon.substring(0, 2)]}
          {/* icon을 날씨 상태에 따라서 보여줄 수 있도록 만들어줌. */}
          <div className="mt-8 text-2xl">
            {weatherInfo.name},{" "}
            {weatherInfo.main.temp.toString().substring(0, 4)} ℃
            {/* toString().substring(0, 4)를 추가하여 온도가 소수점 첫째자리까지만 나오도록 코드를 짬. */}
          </div>
        </div>
      ) : (
        "날씨 정보를 로딩중입니다 ..."
      )}
    </div>
  );
}

export default Weather;
