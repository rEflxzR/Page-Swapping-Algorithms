import React, { Component } from 'react'
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBInput, MDBSelect, MDBSelectInput, MDBSelectOption, MDBSelectOptions } from 'mdbreact';
import Algotable from '../Algotable/algotable'
import axios from 'axios'

class FormPage extends Component {
    constructor(props) {
        super(props)

        this.state = {
            stringInput: '',
            frames: 0,
            algorithm: null,
            dataRecived: false,
            data: []
        }

        this.onAlgoChange = this.onAlgoChange.bind(this)
        this.onStringChange = this.onStringChange.bind(this)
        this.onFrameChange = this.onFrameChange.bind(this)
        this.handleSubmitClick = this.handleSubmitClick.bind(this)
        this.handleResetClick = this.handleResetClick.bind(this)
    }

    onStringChange(evt) {
        this.setState({ stringInput: evt })
    }

    onFrameChange(evt) {
        this.setState({ frames: evt })
    }

    onAlgoChange(evt) {
        this.setState({ algorithm: evt })
    }

    async handleSubmitClick(evt) {
        evt.preventDefault()
        if(this.state.algorithm!==null  && this.state.frames!==0 && this.state.stringInput!=='' && this.state.stringInput!==' ') {
            const apiurl = `http://${window.location.hostname}:3000/resolve`
            const inputstring = this.state.stringInput
            const frames = this.state.frames
            const algo = this.state.algorithm
            await axios.post(apiurl, {inputstring, frames, algo}).then((res) => {
                console.log(res.data)
                this.setState({ dataRecived: true, data: res.data })

            }).catch((err) => {
                console.log("There was an Error Submitting Your Response\n")
                console.log(err)
            })
        }
    }

    handleResetClick() {
      this.setState({ stringInput: '', frames: 0, algorithm: null, dataRecived: false, data: [] })
    }

    render() {
        return (
          <div>
            <MDBContainer>
              <MDBRow center="true">
                <MDBCol md="7">
                  <MDBCard>
                    <div className="header py-3 peach-gradient" style={{ backgroundColor: 'black' }}>
                      <MDBRow className="d-flex justify-content-center">
                        <h3 className="text-light mb-3 pt-3 font-weight-bold">Page Replacement Algorithm Visualizer</h3>
                      </MDBRow>
                    </div>
                    <MDBCardBody className="mx-4 mt-4">
                        
                        <MDBInput getValue={this.onStringChange} value={this.state.stringInput} label="Input String (space seperated)" group type="text" />
                        <MDBInput getValue={this.onFrameChange} value={this.state.frames} label="Frames Size" group type="number" />
                        <MDBSelect getValue={this.onAlgoChange} >
                        <MDBSelectInput selected="Replacement Algorithm" />
                        <MDBSelectOptions>
                            <MDBSelectOption disabled>Choose an Option</MDBSelectOption>
                            <MDBSelectOption value="First In First Out">First In First Out</MDBSelectOption>
                            <MDBSelectOption value="Optimal">Optimal</MDBSelectOption>
                            <MDBSelectOption value="Least Recently Used">Least Recently Used</MDBSelectOption>
                        </MDBSelectOptions>
                        </MDBSelect>

                        <MDBRow className="d-flex align-items-center mb-4 mt-5">
                        <MDBCol className="">
                          <div className="text-center mb-1">
                              <button onClick={this.handleResetClick} className="btn btn-lg btn-block btn-danger">RESET</button>
                          </div>
                          <div className="text-center mt-1">
                              <button onClick={this.handleSubmitClick} className="btn btn-lg btn-block btn-success">VISUALIZE</button>
                          </div>
                        </MDBCol>
                      </MDBRow>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              </MDBRow>
            </MDBContainer>

            <div className="mt-3">
            {
              this.state.dataRecived ? 
              (<Algotable data={this.state.data} frames={this.state.frames}
                algo={this.state.algorithm} string={this.state.stringInput} />)
              :
              (null)
            }
            </div>
          </div>
        )
    }
}

export default FormPage;