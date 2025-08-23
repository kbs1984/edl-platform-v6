export const Divider = ({ text }: { text: string }) => (
  <div className="w-full flex uppercase m-0 px-6 center
    before:flex-[1_0_auto] before:h-0.5 before:border-b before:border-b-text/50 before:content-[''] before:m-0
    after:flex-[1_0_auto] after:h-0.5 after:border-b after:border-b-text/50 after:content-[''] after:m-0
  ">
    <span className="text-center flex-[.2_0_auto] m-0 bg-transparent text-sm"> {text} </span>
  </div>
)