import React, { useState } from "react";
import * as XLSX from 'xlsx';
import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { useStyles } from "./home.style";
import { CloudUpload, FileCopy, GetApp } from "@material-ui/icons";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Exson = () => {
  const [json, setJson] = useState(null);
  const [fileName, setFileName] = useState(null);
  const classes = useStyles();

  const handleFileChange = (event) => {
    if(json) setJson(null);
    const file = event.target.files[0];
    setFileName(file.name.split('.'));
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const result = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const [headers, ...rows] = result;
      const jsonArray = rows.map((row) =>
        headers.reduce((obj, header, index) => ({ ...obj, [header]: row[index] }), {})
      );
      setJson(jsonArray);
    };
    reader.readAsArrayBuffer(file);
    // const validateJson = JSON.parse(`${JSON.stringify(json)}`);
    // console.log('validateJson', json);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(json));
    toast.success('Copied to clipboard', {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000});
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`File downloaded\n (${fileName[0]}.json)`, {position: toast.POSITION.BOTTOM_CENTER, autoClose:5000});
  };


  return (
    <Paper className={classes.root}>
      <ToastContainer />
      <Typography variant="h5" component="h1">
        XON Converter
      </Typography>
      <input
        accept=".xls,.xlsx"
        className={classes.input}
        id="upload-file"
        type="file"
        onChange={handleFileChange}
      />
      
      {!json ? <label htmlFor="upload-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUpload />}
            >
              Upload Excel File
            </Button>
        </label> : (<Grid container>
        <Grid item xs={12}>
          <label htmlFor="upload-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUpload />}
            >
              Upload Another Excel File
            </Button>
          </label>
        </Grid>
        
          <>
            <Grid item xs={12}>
              <pre style={{maxHeight:700, maxWidth: 1440, overflow:'scroll', scrollBehavior:'smooth'}}>{JSON.stringify(json, null, 2)}</pre>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<FileCopy />}
                onClick={handleCopy}
              >
                Copy
              </Button>
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                startIcon={<GetApp />}
                onClick={handleDownload}
              >
                Download
              </Button>
            </Grid>
            
          </>
        
      </Grid>
      )}
    </Paper>
  );
};

export default Exson;