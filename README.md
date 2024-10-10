# X-Store
An online platform where users can explore a wide variety of games, access detailed information about each game, and make purchases. After purchasing a game, users can leave a review or comment within 7 days, which will be visible to other potential buyers. 

- adding or editing this code in each controller     if (error.code === 11000) {
      let duplicatedKey = Object.keys(error.keyPattern)[0];
      const capitalizedDuplicatedKey = duplicatedKey.charAt(0).toUpperCase() + duplicatedKey.slice(1);
      return res.status(400).json({
        message: `${capitalizedDuplicatedKey} language must be unique`,
        status: "fail",
      });
    }

    