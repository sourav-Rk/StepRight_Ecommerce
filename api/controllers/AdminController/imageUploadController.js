

export const uploadImages=(req,res,next)=>{

   

    try{
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "No files uploaded" });
        }


        const uploadedFiles = req.files.map((file)=>({
            url:file.path,
            public_id:file.filename,
        }));

      
       return res.status(200).json({message:"Image uploaded successfully!",data:uploadedFiles})
    }
    catch(error)
    {
       return res.status(500).json({message : "Internal server error"})
    }
}

