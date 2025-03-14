import Spinner from "@/components/common/spinner/spinner"
import React from "react"

const Loading = () => {
  return (
    <div className="h-[80vh] flex justify-center items-center">
      <Spinner />
    </div>
  )
}

export default Loading
