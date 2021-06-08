import * as assert from "assert";
import * as passport from "passport";
import * as passportGoogleOAuth2 from "passport-google-oauth2";
import { Inject, Service } from "typedi";
import * as marvinOAuth2 from "../auth/marvin";
import config from "../config";
import User from "../entities/User";
import Achievements from "../game/Achievements";
import AchievementProgressService from "./AchievementProgressService";
import AuthService from "./AuthService";
import AvatarService from "./AvatarService";
import UserService from "./UserService";

@Service()
export default class OAuthService {
  constructor(
    @Inject()
    private readonly userService: UserService,

    @Inject()
    private readonly achievementProgressService: AchievementProgressService,

    @Inject()
    private readonly authService: AuthService,

    @Inject()
    private readonly avatarService: AvatarService
  ) {}

  public install() {
    this.installGoogle();
    this.installMarvin();
  }

  private async verify(
    email: string,
    picture: string,
    callback: passportGoogleOAuth2.VerifyCallback
  ) {
    try {
      assert(email, "email is null");

      let user = await this.userService.findByEmail(email);

      if (!user) {
        user = new User();
        user.username = email.split("@")[0];
        user.email = email;
        user.admin = false;
        user.picture = await this.avatarService.download(picture);

        user = await this.userService.save(user);

        await this.achievementProgressService.unlock(
          Achievements.REGISTERED,
          user
        );
      }

      callback(null, await this.authService.authenticate(user));
    } catch (error) {
      callback(error, null);
    }
  }

  private installGoogle() {
    passport.use(
      new passportGoogleOAuth2.Strategy(
        {
          clientID: config.GOOGLE_ID,
          clientSecret: config.GOOGLE_SECRET,
          callbackURL: "http://localhost:3000/auth/google/callback",
        },
        async (_accessToken, _refreshToken, profile, callback) => {
          const { email, picture } = profile;

          await this.verify(email, picture, callback);
        }
      )
    );
  }

  private installMarvin() {
    passport.use(
      "marvin",
      marvinOAuth2.Strategy(
        {
          clientID: config.MARVIN_ID,
          clientSecret: config.MARVIN_SECRET,
          callbackURL: "http://localhost:3000/auth/marvin/callback",
        },
        async (_accessToken, _refreshToken, profile, callback) => {
          console.log(profile)
          const { email, image_url } = profile;

          await this.verify(email, image_url, callback);
        }
      )
    );
  }
}
