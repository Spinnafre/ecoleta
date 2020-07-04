import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import './dropzone.css'
interface Props {
    onFileUpload: (file: File) => void
}

const MyDropzone: React.FC<Props> = ({ onFileUpload }) => {
    const [urlImage, setUrlImage] = useState('')

    /*O uso da callback é recomendável para quando um
    determinada informação seja atualizada somente quando
    detrminado fator for alterado.
    */
    const onDrop = useCallback(acceptedFiles => {
        const file = acceptedFiles[0]
        const fileUrl = URL.createObjectURL(file)

        setUrlImage(fileUrl)
        onFileUpload(file)
    }, [onFileUpload])
    const getUploadParams = () => {
        return { url: {urlImage} }
    }
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: 'image/*'})

    return (
        <div className="dropzone"  {...getRootProps()} >
            <input {...getInputProps()} accept='image/*' />
            

            {urlImage ? <img src={urlImage}></img> :
                <p>
                    <FiUpload />
                Selecionar aquivo imagem
            </p>

            }

        </div>
    )
}

export default MyDropzone