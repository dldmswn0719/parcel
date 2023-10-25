import { useEffect , useState } from "react";

interface Company {
  International : string;
  Code : string;
  Name : string
}

interface ThemeColor {
  [key : string] : {
    back : string;
    hover : string;
    active : string;
    text : string;
    outline : string;
  }
}

interface ButtonType {
  name : string;
  theme : string;
}


function App() {

  const [carriers, setCarriers] = useState<Company[]>([]);
  // usestate 타입 설정하기 useState<string>(); 필터되어서 보여짐,필터후
  const [allCarriers,setAllCarriers] = useState<Company[]>([]);
  // 모든 데이터 넣어둔걸 유지하고 필터된것은 위에서 국내,국외로 할거임,필터될때
  const [theme , setTheme] = useState<string>('default');
  // 객체안에 객체가 들어갈거임

  const [tcode,setTcode] = useState<string>('04');
  // 택배코드
  const [tinvoice,setTinvoice] = useState<string>('');
  // 실제 운송장 번호라서 빈값
  const [tname,setTname] = useState<string>('CJ대한통운');
  const [isBtn,setIsBtn] = useState<number | null>(null);
  // const [isBtn,setIsBtn] = useState<number>();

  const [infoTracking,setInfoTracking] = useState<string>()

  const themeColor : ThemeColor = {
    "default" : {
      "back" : "bg-[#03588c]",
      "hover" : "hover:bg-[#0477be]",
      "active" : "bg-[#0468a5]",
      "text" : "text-[#03588c]",
      "outline" : "outline-[#0477be]"
    },
    "pink" : {
      "back" : "bg-[#fc7283]",
      "hover" : "hover:bg-[#fda4af]",
      "active" : "bg-[#fc8b99]",
      "text" : "text-[#fc7283]",
      "outline" : "outline-[#fda4af]"
    },
    "skyblue" : {
      "back" : "bg-[#38bdf8]",
      "hover" : "hover:bg-[#69cdfa]",
      "active" : "bg-[#51c5f9]",
      "text" : "text-[#38bdf8]",
      "outline" : "outline-[#69cdfa]"
    }
  }

  const buttons : ButtonType[] = [
    {name : "기본" , theme : "default"},
    {name : "핑크" , theme : "pink"},
    {name : "스카이블루" , theme : "skyblue"}
  ]

  useEffect(()=>{
    const fetchData = async () =>{
      try{
        const res = await fetch(`http://info.sweettracker.co.kr/api/v1/companylist?t_key=${process.env.REACT_APP_API_KEY}`)
        const data = await res.json();
        // console.log(data)
        setCarriers(data.Company);
        setAllCarriers(data.Company)
      }catch(error){
        console.log(error)
      }
    }
    fetchData()
  },[])

  const selectCode = (BtnNumber : number , code : string , name : string) => {
    setIsBtn(BtnNumber)
    setTcode(code)
    setTname(name);
    const isInternational = BtnNumber === 2 ? 'true' : 'false';
    const filterCarriers = allCarriers.filter(e => e.International === isInternational);
    setCarriers(filterCarriers)
  }

  const blindNumber = (e:React.ChangeEvent<HTMLInputElement>) =>{
    const value = e.target.value;
    e.target.value = e.target.value.replace(/[^0-9]/g,'')
    setTinvoice(value)
  }

  const PostSubmit = async () =>{
    // console.log(tcode,tinvoice)
    // const url = new URL(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)
    // const url = new URL("http://info.sweettracker.co.kr/api/v1/trackingInfo");
    // url.searchParams.append("t_code",tcode)
    // url.searchParams.append("t_invoice",tinvoice)
    // url.searchParams.append("t_key",`${process.env.REACT_APP_API_KEY}`)
    // console.log(url)
    try{
      const res = await fetch(`http://info.sweettracker.co.kr/api/v1/trackingInfo?t_code=${tcode}&t_invoice=${tinvoice}&t_key=${process.env.REACT_APP_API_KEY}`)
      const data = res.json()
      console.log(data)
    }catch(error){
      console.log(error)
    }
  }

  return (
   <>
    <div className={`p-5 text-black text-sm md:text-xl xl:text-2xl flex justify-between ${themeColor[theme].back}`}>
      <h3 className="font-extrabold">국내.외 택배조회 시스템</h3>
      <div>
        <span>테마 : </span>
        {
          buttons.map((e,i)=>{
            return(
              <button onClick={()=>setTheme(e.theme)} key={i} className="mx-1 md:mx-2 xl:mx-3">{e.name}</button>
            )
          })
        }
      </div>
    </div>
    <div className="w-4/5 md:w-3/5 xl:w-4/12 mx-auto my-40 flex rounded items-center pt-2 flex-wrap">
      <div className="border-b basis-full py-2 px-2 flex justify-center items-center text-sm">
        <span className="bais-[30%] text-center mr-5">국내 / 국외 선택</span>
        <button className={`text-sm border p-1 px-5 rounded hover:text-white mr-4 ${isBtn === 1 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 1 ? themeColor[theme].active : ''}`} onClick={()=> selectCode(1,'04','CJ대한통운')}>국내</button>
        <button className={`text-sm border p-1 px-5 rounded hover:text-white ${isBtn === 2 ? 'text-white' : 'text-black'} ${themeColor[theme].hover} ${isBtn === 2 ? themeColor[theme].active : ''}`} onClick={()=> selectCode(2,'12','EMS')}>국외</button>
      </div>
      {/* {tcode}{tname} */}
      <div className="basis-full py-4 border-b">
        <select className="w-full border p-2 rounded-md" value={tcode} onChange={(e)=>{setTcode(e.target.value)}}>
        {/* <select className="w-full border p-2 rounded-md appearance-none" value={tcode} onChange={(e)=>{setTcode(e.target.value)}}> */}
        {/* appearance-none 화살표 사라짐 , 다른것 넣을려면 background 로 설정 */}
          {
            carriers.map((e,i)=>{
              return(
                <option key={i} value={e.Code}>
                  {e.Name}
                </option> 
              )
            })
          }
        </select>
      </div>
      {tinvoice}
      <div className="basis-full py-4 border-b text-center">
        <input type="text" onInput={blindNumber} placeholder="운송장 번호를 입력해주세요" className={`w-full border px-5 py-2 rounded-md ${themeColor[theme].outline}`} />
      </div>
      <div className="basis-full border-b py-4 text-center">
        <button className={`${themeColor[theme].back} text-white px-5 py-2 rounded-md w-full`} onClick={PostSubmit}>조회하기</button>
      </div>
    </div>
   </>
  );
}

export default App;
