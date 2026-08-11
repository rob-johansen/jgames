import { Modal } from '@/components/Modal'

type Props = {
  onEscape: (value: boolean) => void
}

export const Phases = ({ onEscape }: Props) => {
  return (
    <Modal
      className="[&>div:first-child]:hidden flex flex-col items-center min-w-[182px] pt-[8px]"
      onEscape={onEscape}
      title=""
    >
      <div className="bg-phase10-cover-blue font-bold h-[300px] drop-shadow-lg font-quicksand overflow-hidden relative rounded-[8px] select-none text-white w-[200px]">
        <div className="left-[24px] relative rotate-[-6deg] text-[2.125rem] top-[-2px]">
          <span className="underline">
            Phase 10
          </span>
          <span className="relative text-[1.125rem] top-[-8px]">
            ®
          </span>
        </div>
        <ol className="left-[29px] list-decimal pl-[10px] relative text-[0.875rem] top-[-1px]">
          <li className="rotate-[-6deg]">2 sets of 3</li>
          <li className="rotate-[-6deg]">1 set of 3 + 1 run of 4</li>
          <li className="rotate-[-6deg]">1 set of 4 + 1 run of 4</li>
          <li className="rotate-[-6deg]">1 run of 7</li>
          <li className="rotate-[-6deg]">1 run of 8</li>
          <li className="rotate-[-6deg]">1 run of 9</li>
          <li className="rotate-[-6deg]">2 sets of 4</li>
          <li className="rotate-[-6deg]">7 cards of 1 color</li>
          <li className="rotate-[-6deg]">1 set of 5 + 1 set of 2</li>
          <li className="rotate-[-6deg]">1 set of 5 + 1 set of 3</li>
        </ol>
        <div className="relative">
          <div className="bg-phase10-card-red h-[5px] mt-[17px] skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-blue h-[5px] mt-[2px] relative skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-green h-[5px] mt-[2px] relative skew-y-[-7deg] w-full" />
          <div className="bg-phase10-card-purple h-[5px] mt-[2px] relative skew-y-[-7deg] w-full" />
        </div>
      </div>
    </Modal>
  )
}
