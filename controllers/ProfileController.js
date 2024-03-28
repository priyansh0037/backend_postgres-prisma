import { generateRandomNum, imageValidator } from "../utils/helper.js";
import prisma from "../DB/db.Config.js";

export const profileController = async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).json({
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: error.message,
    });
  }
};

// update progile

export const profileUpdate = async (req, res) => {
    //   const authUser = req.user;
    
    try {
      const { id } = req.params;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          message: "profile image not found",
        });
      }
    
      const profile = req.files.profile;
      const message = imageValidator(profile?.size, profile?.mimetype);
    
      if (message !== null) {
        return res.status(400).json({
          errors: {
            profile: message,
          },
        });
      }
      // /image extenstion
      const imgExt = profile.name.split(".");
      const imageName = generateRandomNum() + "." + imgExt[1];
    
      const uploadPath = process.cwd() + "/public/images/" + imageName;
    
      profile.mv(uploadPath, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({
            error: "something went wrong",
          });
        }
      });
    
      await prisma.users.update({
          data:{
            profile:imageName
          },
          where:{
              id:Number(id)
          }
      })
    
      return res.json({
        name: profile.name,
    
        size: profile?.size,
        mime: profile?.mimetype,
    
        message:"profile updated succesfully"
      });
        
  } catch (error) {
console.log(error)    
    return res.status(500).json({
      error: error.message,
      mesage:"something went wrong"
    })
  }
};
