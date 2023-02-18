import { Request, Response } from "express";
import { User } from "../models/UserModel";

export const getLikedBeer = async(req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if(user) {
      return res.json({msg: "success", beers: user.likedBeers});
    } else return res.json({msg: "User with given email not found"});
  } catch (error) {
    return res.json({msg: "Error fetching beers"});
  } 
};

export const addToLikedBeers = async (req: Request, res: Response) => {
  try {
    const { email, data } = req.body;
    const user = await User.findOne({ email });
    if(user) {
      const { likedBeers } = user;
      const beerAlreadyLiked = likedBeers.find(({id}) => id === data.id);
      if(!beerAlreadyLiked) {
        await User.findByIdAndUpdate(
          user._id,
          {
            likedBeers: [...user.likedBeers, data],
          },
          { new: true}
        );
      } else return res.json({ msg: "Beer already added to the liked list"});
    } else await User.create({ email, likedBeers: [data] });
    return res.json({ msg: "Beer successfully added to liked list"});
  } catch (error) {
    return res.json({ msg: "Error adding beer to the liked list"});
  }
};

export const  removeFromLikedBeers = async(req: Request, res: Response) => {
  try {
    const { email, beerId } = req.body;
    const user = await User.findOne({ email });
    if(user) {
      const beers = user.likedBeers;
      const beerIndex = beers.findIndex(({ id }) => id === beerId);
      if(!beerIndex) {
        res.status(400).send({ msg: "Beer not found"});
      }
      beers.splice(beerIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedBeers: beers,
        },
        { new: true }
      );
      return res.json({ msg: "Beer successfully removed", beers});
    } else return res.json({ msg: "User with given email not found"});
  } catch (error) {
    return res.json({ msg: "Error removing beer to the liked list"});
  }
}