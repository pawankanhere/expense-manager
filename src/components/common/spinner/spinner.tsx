import { IconLoader2 } from "@tabler/icons-react"
import React from "react"

const Spinner = () => {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <IconLoader2 className="animate-spin text-primary" />
    </div>
  )
}

export default Spinner
