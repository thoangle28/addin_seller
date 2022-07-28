import { useState } from 'react'
import Dropzone from 'react-dropzone'

export const handleFileUpload = (files: any) => {
    const filesList: any = Array.from(files)
    /* Map each file to a promise that resolves to an array of image URI's */
    return Promise.all(
      filesList.map((file: any) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result)
          reader.onerror = (error) => reject(error)
        })
      })
    )
  }
  
export const UploadImageField = (props: any) => {
    const {setFileToState, setFieldValue, fileName, 
          isMultiple = true, setFieldToInput, 
          inputName, textLabel, maxFiles = 1} = props
    const textNoticed = textLabel ? textLabel : "Click here to change."

    const [totalFiles, setTotalFiles] = useState(0)

    return (
      <>
        <div className='form-group mt-1'>
          <Dropzone
            multiple={isMultiple}
            maxFiles={maxFiles}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles && acceptedFiles !== undefined) {
                handleFileUpload(acceptedFiles).then(
                  (images) => {
                    setFileToState && setFileToState(images)
                    setFieldValue(fileName, images)
                    setFieldToInput && setFieldToInput(inputName, images[0])
                  },
                  (error) => {
                    console.error(error)
                  }
                )
              }
            }}
            onDropRejected = {(rejectedFiles) => {                       
              setTotalFiles(rejectedFiles.length)
            }}
            onDropAccepted = {(filesAccepted) => {
              setTotalFiles(0) //reset
            }}
          >
            {({getRootProps, getInputProps}) => (
              <section className='notice d-flex bg-light-primary rounded border-primary border border-dashed py-3 px-2 dropzone dz-clickable'>
                <div {...getRootProps()}>
                  <input {...getInputProps()} name={fileName} accept='image/*' />
                  <div
                    className='dropzone-msg dz-message needsclick d-flex align-items-center'
                    style={{cursor: 'pointer'}}
                  >
                    <i className='bi bi-file-earmark-arrow-up text-primary fs-3x'></i>
                    <div className='ms-4'>
                      <span className='fs-8 text-gray-normal mb-1'>
                        {textNoticed}    
                        {
                          (totalFiles > maxFiles) ? (
                            <span style={{color: '#ff0000'}}>
                              <br /> Error: {totalFiles} files have been selected.
                            </span>
                          ) : ''
                        }                    
                      </span>
                    </div>
                  </div>                  
                </div>
              </section>
            )}
          </Dropzone>
        </div>
      </>
    )
  }