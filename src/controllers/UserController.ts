import { Request, Response } from "express";
import { User } from "../models/UserModel";

export const getLikedBeer = async(req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });
    if(user) {
      return res.json({msg: "success", beers: user.likedBeers});
    } else return res.json({msg: "사용자 메일을 찾을 수 없습니다"});
  } catch (error) {
    return res.json({msg: "맥주를 가져오는데 실패하였습니다"});
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
        return res.status(200).json({ msg: "맥주를 성공적으로 좋아요 목록에 추가하였습니다"});
      } else {
        return res.status(400).json({ msg: "이미 찜한 맥주입니다"});
      }
    } else {
      await User.create({ email, likedBeers: [data] });
      return res.status(200).json({ msg: "맥주를 성공적으로 좋아요 목록에 추가하였습니다"});
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ msg: "좋아요 목록에 추가하는 도중 오류가 발생하였습니다"});

  }
};


export const  removeFromLikedBeers = async(req: Request, res: Response) => {
  try {
    const { email, beerId } = req.body;
    const user = await User.findOne({ email });
    if(user) {
      const beers = user.likedBeers;
      const beerIndex = beers.findIndex(({ id }) => id === beerId);
      if(beerIndex === -1) {
        res.status(400).json({ msg: "맥주를 찾을 수 없습니다"});
        return;
      }
      beers.splice(beerIndex, 1);
      await User.findByIdAndUpdate(
        user._id,
        {
          likedBeers: beers,
        },
        { new: true }
      );
      return res.json({ msg: "삭제를 성공하였습니다", beers});
    } else return res.status(404).json({ msg: "사용자 메일을 찾을 수 없습니다"});
  } catch (error) {
    return res.status(500).json({ msg: "좋아요 목록 삭제 도중 오류가 발생하였습니다"});
  }
}