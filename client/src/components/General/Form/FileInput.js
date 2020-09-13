import React from 'react';
import axios from 'axios';

function FileInput() {

    const [file, setFile] = useState();
  
    function onFilesAdded(event) {
      setFile(event.target.files[0])
    }
  
    function onSubmit(event) {
      event.preventDefault();
      if(file){
        const url = "/api/student/test/testUpload";
        const formData = new FormData();
        formData.append('file',file)
        const config = {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'content-type': 'multipart/form-data'
            }
        }
        axios.post(url, formData, config).then(function(res){
          console.log(res);
        }).catch(function(err){
          console.log(err)
        })
      }
    }
  
    function brr(event){
      axios.get('/api/student/test/testUpload').then((res) => {
        console.log(res);
      }).catch((err) => console.log(err));
    }
  
    return (
      <div>
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFilesAdded} />
        <TealButton type="submit" text="Submit" />
      </form>
       <a target="_blank" href="/api/student/test/testUpload"> GET </a>
       </div>
    )
}

export default FileInput;