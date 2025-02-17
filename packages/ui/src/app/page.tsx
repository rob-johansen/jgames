import type React from 'react'

import { ButtonLink } from '@/components/button-link/ButtonLink'

export default function Home(): React.JSX.Element {
  return (
    <div className="absolute bg-phase10-cover-blue flex flex-col font-quicksand h-[386px] inset-0 items-center m-auto overflow-hidden rounded-[8px] text-white w-[300px]">
      <div className='flex flex-col font-bold items-center relative rotate-[-6deg] text-[3rem] top-[-8px]'>
        <span>Phase</span>
        <span className="relative top-[-32px]">10</span>
      </div>
      <p className="bottom-[48px] font-bold leading-[20px] relative rotate-[-6deg] text-center w-[200px]">
        A rummy-type card game
        with an exciting twist!
      </p>
      <div className="bg-gradient-to-r bottom-[36px] from-[#840008] h-[50px] phase10-card-top relative rotate-[-6deg] to-[#e90010] w-[310px]" />
      <div className="absolute bg-white flex flex-col justify-between h-[78px] left-[1px] p-[3px] rotate-[80deg] rounded-[5px] skew-y-[-17deg] top-[147px] w-[50px]">
        <div className="bg-phase10-card-red flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full">
          <span className="relative top-[-4px]">2</span>
          <span className="relative text-[0.7rem] top-[-1px]">2</span>
        </div>
        <span className="font-bold left-[12px] relative text-[2rem] text-phase10-card-red top-[-10px]">2</span>
        <div
          className="bg-phase10-card-red bottom-[16px] flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] relative rounded-t scale-[-1] w-full">
          <span className="relative scale-[-1] top-[1px]">2</span>
          <span className="relative scale-[-1] text-[0.7rem] top-[-5px]">2</span>
        </div>
      </div>
      <div className="bg-gradient-to-r bottom-[49px] from-[#0c2b5b] h-[50px] left-[40px] phase10-card-top relative rotate-[-12.5deg] to-[#196ac8] w-[250px]" />
      <div className="absolute bg-white flex flex-col justify-between h-[78px] left-[70px] p-[3px] rotate-[75deg] rounded-[5px] skew-y-[-19deg] top-[190px] w-[50px]">
        <div className="bg-phase10-card-blue flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full">
          <span className="relative top-[-4px]">0</span>
          <span className="relative text-[0.7rem] top-[-1px]">0</span>
        </div>
        <span className="font-bold left-[12px] relative text-[2rem] text-phase10-card-blue top-[-10px]">0</span>
        <div
          className="bg-phase10-card-blue bottom-[16px] flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] relative rounded-t scale-[-1] w-full">
          <span className="relative scale-[-1] top-[1px]">0</span>
          <span className="relative scale-[-1] text-[0.7rem] top-[-5px]">0</span>
        </div>
      </div>
      <div className="bg-gradient-to-r bottom-[76px] from-[#144616] h-[50px] left-[110px] phase10-card-top relative rotate-[-21.5deg] to-[#137313] w-[138px]" />
      <div className="absolute bg-white flex flex-col justify-between h-[78px] left-[140px] p-[3px] rotate-[68deg] rounded-[5px] skew-y-[-19deg] top-[230px] w-[50px]">
        <div className="bg-phase10-card-green flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full">
          <span className="relative top-[-4px]">2</span>
          <span className="relative text-[0.7rem] top-[-1px]">2</span>
        </div>
        <span className="font-bold left-[12px] relative text-[2rem] text-phase10-card-green top-[-10px]">2</span>
        <div
          className="bg-phase10-card-green bottom-[16px] flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] relative rounded-t scale-[-1] w-full">
          <span className="relative scale-[-1] top-[1px]">2</span>
          <span className="relative scale-[-1] text-[0.7rem] top-[-5px]">2</span>
        </div>
      </div>
      <div className="bg-gradient-to-r bottom-[86px] from-[#6a0dad] h-[50px] left-[130px] phase10-card-top relative rotate-[-34.5deg] to-[#7350c8] w-[80px]" />
      <div className="absolute bg-white flex flex-col justify-between h-[78px] left-[216px] p-[3px] rotate-[54deg] rounded-[5px] skew-y-[-19deg] top-[256px] w-[50px]">
        <div className="bg-phase10-card-purple flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] rounded-t w-full">
          <span className="relative top-[-4px]">5</span>
          <span className="relative text-[0.7rem] top-[-1px]">5</span>
        </div>
        <span className="font-bold left-[12px] relative text-[2rem] text-phase10-card-purple top-[-10px]">5</span>
        <div
          className="bg-phase10-card-purple bottom-[16px] flex font-bold font-quicksand h-[20px] justify-between phase10-card-top-cover pl-[4px] pr-[4px] relative rounded-t scale-[-1] w-full">
          <span className="relative scale-[-1] top-[1px]">5</span>
          <span className="relative scale-[-1] text-[0.7rem] top-[-5px]">5</span>
        </div>
      </div>
      <ButtonLink
        className="absolute active:opacity-80 bg-gradient-to-br border border-white bottom-[30px] from-[#4568dc] from-[-0.27%] hover:opacity-90 left-[35px] to-[#b06ab3] to-[134.14%]"
        href="/phase10"
      >
        Play
      </ButtonLink>
    </div>
  );
}

// 2.25w 3.5h
// The box: https://imgs.search.brave.com/KLqRXeoD5rn1bPE92y082E4BPOJ_5IgIb5p1FoF5lWs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5yYWlucG9zLmNv/bS83MDYwL2ExdmV4/ZXlhOGpsX2FjX3Ns/MTUwMF8uanBn
// Ture purple will replace yellow: #6a0dad
// subtract 1, add 45, subtract 3
