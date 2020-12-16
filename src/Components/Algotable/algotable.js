import React, { Component } from 'react'

class Algotable extends Component {
    
    render() {
        let arr = this.props.string.replace(/\s/g, '').split("")

        return(
            <div className="container px-0">
                <div className="jumbotron">
                    <h2 className="h1 text-center mb-5">Summary for <span className="text-uppercase">{this.props.algo}</span> Algorithm</h2>

                    <div className="d-flex justify-content-center mb-4">
                        <table className="mx-0" style={{width: '15%'}}>
                            <tr style={{ height: '35px', border: '2px solid black' }} className="border-right-0">
                                <td className="text-center font-weight-bolder">Page Sequence</td>
                            </tr>
                            {
                                arr.map((e) => {
                                    return <tr style={{ border: '2px solid black' }} className="border-right-0">
                                        <td className="text-center font-weight-bold">{e}</td>
                                    </tr>
                                })
                            }
                        </table>
                        <table className="mx-0" style={{maxWidth: "70vw", minWidth: "25vw"}}>
                            <tr style={{ height: '35px' }}>
                                {
                                    [...new Array(Number(this.props.frames))].map((e) => {
                                        return <td className="text-center font-weight-bolder" style={{ border: '2px solid black' }}>f</td>
                                    })
                                }
                                <td className="text-center font-weight-bolder" style={{ border: '2px solid black' }}>Page Hit/Miss</td>
                            </tr>
                            {
                                this.props.data.finalFramesTable.map((el) => {
                                    return <tr>
                                        {
                                            el.map((e) => {
                                                if(e==="hit") {
                                                    return <td style={{ backgroundColor: '#55FF00', border: '2px solid black' }} className="text-center font-weight-bold">{e}</td>
                                                }
                                                else if(e==="fault") {
                                                    return <td style={{ backgroundColor: '#ff4e36', border: '2px solid black' }} className="text-center font-weight-bold">{e}</td>
                                                }
                                                return <td style={{ border: '2px solid black', minWidth: '50px' }} className="text-center font-weight-bold">{e}</td>
                                            })
                                        }
                                        </tr>
                                })
                            }
                        </table>
                    </div>
        
                    <div className="d-flex justify-content-center">
                        <div className="card border border-dark" style={{width: "22rem"}}>
                            <div className="card-body">
                                <p>Total Number of Pages: <span className="font-weight-bold">{arr.length}</span></p>
                                <p>Input Page Sequence: <span className="font-weight-bold">{this.props.string}</span></p>
                                <p>Number of Memory Frames: <span className="font-weight-bold">{this.props.frames}</span></p>
                                <p>Total Page Hits: <span className="font-weight-bold">{this.props.data.totalPageHits}</span></p>
                                <p>Hit Rate: <span className="font-weight-bold">{(this.props.data.totalPageHits/arr.length*100).toFixed(2)}%</span></p>
                                <p>Total Page Faults: <span className="font-weight-bold">{this.props.data.totalPageFaults}</span></p>
                                <p>Fault Rate: <span className="font-weight-bold">{(this.props.data.totalPageFaults/arr.length*100).toFixed(2)}%</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Algotable