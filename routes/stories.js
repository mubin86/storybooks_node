const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/Story");
const { populate } = require("../models/Story");

// @description    Show add page
// @route          GET /stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

// @description    Process(Story) add form
// @route          POST /stories
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id; //req.user.id ta req.body.user er moddhe
    await Story.create(req.body); //assign kora hocce cz Story mdl e user
    res.redirect("/dashboard"); //field ase...baki value form theke passi
  } catch (error) {
    console.log(error); //uporer procedure maddhome kon user kon story create
    res.render("error/500"); // kortse ta peye jassi
  }
});

// @description    Show all stories
// @route          GET /stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user") //populate diye User model er shb data passi
      .sort({ cratedAt: "desc" })
      .lean(); //plan JS object format e data convert kore

    res.render("stories/index", { stories });
  } catch (error) {
    console.log(error);
    return res.render("error/500");
  }
});

// @description    Show single story
// @route          GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }
    res.render("stories/show", { story });
  } catch (error) {
    console.log(error);
    res.render("error/404");
  }
});

// @description    Show edit page
// @route          GET /stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
    }).lean();

    if (!story) {
      return res.redirect("error/404");
    }

    if (story.user != req.user.id) {
      //req.user.id means current logged in user
      res.redirect("/stories");
    } else {
      res.render("stories/edit", { story });
    }
  } catch (error) {
    console.log(error);
    return res.render("error/505");
  }
});

// @description    Update story
// @route          PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true, //create a new one if doesnot exist
        runValidators: true, //make sure mongoose fields are valid
      });
    }
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.render("error/505");
  }
});

// @description    Delete story
// @route          DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    await Story.remove({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    return res.render("error/505");
  }
});

// @description    Single User stories
// @route          GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

module.exports = router;
