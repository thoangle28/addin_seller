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
    const {setFileToState, setFieldValue, fileName, isMultiple = true} = props
    return (
      <>
        <div className='form-group mt-1'>
          <Dropzone
            multiple={isMultiple}
            onDrop={(acceptedFiles) => {
              if (acceptedFiles && acceptedFiles !== undefined) {
                handleFileUpload(acceptedFiles).then(
                  (images) => {
                    setFileToState && setFileToState(images)
                    setFieldValue(fileName, images)
                  },
                  (error) => {
                    console.error(error)
                  }
                )
              }
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
                        Click here to change.
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