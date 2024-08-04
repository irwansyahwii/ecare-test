'use client';
import React from "react"

class ErrorBoundary extends React.Component {
  constructor(props: {}) {
    super(props)
 
    // Define a state variable to track whether is an error or not
    this.state = { hasError: false, errorMessage: "" }
  }
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI
 
    return { hasError: true, errorMessage: error + "" }
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can use your own error logging service here
    console.log({ error, errorInfo })    
  }
  render() {
    // Check if the error is thrown
    if ((this.state as any).hasError) {
      // You can render any custom fallback UI
      return (
        <div>
          <h2>Oops, there is an error!</h2>
          <h3>{(this.state as any).errorMessage}</h3>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again?
          </button>
        </div>
      )
    }
 
    // Return children components in case of no error
 
    return (this.props as any).children
  }
}
 
export default ErrorBoundary