import { cn } from '@/lib/utils'

export const Steps = ({steps, current}: {steps: string[], current: number}) => {
  return (
    <nav aria-label="Progress" className="absolute -top-24 left-1/2 -translate-x-1/2">
      <ol role="list" className="flex items-center">
        <div aria-hidden="true" className="absolute inset-0 flex items-center -translate-x-1/2">
          <div className={`h-0.5 w-1/2 bg-linear-to-r from-transparent from-10% ${current >= 0 ? "to-white" : "to-gray-500"}`} />
        </div>
        <div aria-hidden="true" className="absolute inset-0 flex items-center -translate-x-1/2">
          <div className={`h-0.5 w-1/2 bg-linear-to-r from-transparent from-10% ${current >= 0 ? "to-white" : "to-gray-500"} blur-[10px] opacity-80`} />
        </div>
        {steps.map((step, stepIdx) => (
          <li key={step} className={cn(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-40' : '', 'relative')}>
            {stepIdx < current ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-white shadow-[0_0_5px_2px_#6b728080]" />
                </div>
                <a
                  href="#"
                  className="relative flex size-6 items-center justify-center rounded-full bg-white shadow-[0_0_10px_2px_#6b728080]"
                >
                  <span className="sr-only">{step}</span>
                  <span className="absolute -top-full min-w-20 -translate-y-2 flex center">{step}</span>
                </a>
              </>
            ) : current === stepIdx ? (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-500 shadow-[0_0_5px_2px_#6b728080]" />
                </div>
                <a
                  href="#"
                  aria-current="step"
                  className="relative flex size-6 items-center justify-center rounded-full border-2 border-white bg-gray-500 shadow-[0_0_10px_2px_#6b728080]"
                >
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-white" />
                  <span className="sr-only">{step}</span>
                  <span className="absolute -top-full min-w-20 -translate-y-[14px] flex center">{step}</span>
                </a>
              </>
            ) : (
              <>
                <div aria-hidden="true" className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-500 shadow-[0_0_5px_2px_#6b728080]" />
                </div>
                <a
                  href="#"
                  className="group relative flex size-6 items-center justify-center rounded-full border-2 border-gray-500 bg-background shadow-[0_0_10px_2px_#6b728080]"
                >
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-transparent" />
                  <span className="sr-only">{step}</span>
                  <span className="absolute -top-full min-w-20 -translate-y-[14px] flex center">{step}</span>
                </a>
              </>
            )}
          </li>
        ))}
        <div aria-hidden="true" className="absolute inset-0 flex items-center translate-x-full">
          <div className="h-0.5 w-1/2 bg-linear-to-l from-transparent from-10% to-gray-500" />
        </div>
        <div aria-hidden="true" className="absolute inset-0 flex items-center translate-x-full">
          <div className="h-0.5 w-1/2 bg-linear-to-l from-transparent from-10% to-gray-100 blur-[10px] opacity-80" />
        </div>
      </ol>
    </nav>
  )
}
