import { CircularProgress } from "@mui/material";

const Loading = () => {

    return(
        <div style={{display: "flex", flex: 1, alignItems: "center", justifyContent:"center", height: "80vh"}}>
            <CircularProgress color="secondary" style={{alignContent: "center", justifyContent: "center"}} size={80} thickness={4}/>
        </div>
    )
}

export default Loading;