const router = require("express").Router();
const { User } = require("../models/user.model");
const joi = require("joi");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL,
    pass: process.env.PASS,
  },
  secure: true,
});

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ msg: error.details[0].message });
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).send({ msg: "El correo no ha sido registrado" });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).send({ msg: "Contraseña Incorrecta" });
    }

    const token = user.generateAuthToken(user.id);

    res
      .status(200)
      .send({ token, user: user.id, msg: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ msg: "Internal server error" });
  }
});

router.post("/send-email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    const data = { email: user.email, name: user.fullname };
    const encodeData = btoa(JSON.stringify(data));

    const mailData = {
      from: "MuuApp",
      to: req.body.email,
      subject: "Sending Email using NodeJS",
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:v="urn:schemas-microsoft-com:vml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
    >
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title></title>
    
        <style type="text/css">
          @media only screen and (min-width: 620px) {
            .u-row {
              width: 600px !important;
            }
            .u-row .u-col {
              vertical-align: top;
            }
    
            .u-row .u-col-50 {
              width: 300px !important;
            }
    
            .u-row .u-col-100 {
              width: 600px !important;
            }
          }
    
          @media (max-width: 620px) {
            .u-row-container {
              max-width: 100% !important;
              padding-left: 0px !important;
              padding-right: 0px !important;
            }
            .u-row .u-col {
              min-width: 320px !important;
              max-width: 100% !important;
              display: block !important;
            }
            .u-row {
              width: calc(100% - 40px) !important;
            }
            .u-col {
              width: 100% !important;
            }
            .u-col > div {
              margin: 0 auto;
            }
          }
          body {
            margin: 0;
            padding: 0;
          }
    
          table,
          tr,
          td {
            vertical-align: top;
            border-collapse: collapse;
          }
    
          p {
            margin: 0;
          }
    
          .ie-container table,
          .mso-container table {
            table-layout: fixed;
          }
    
          * {
            line-height: inherit;
          }
    
          a[x-apple-data-detectors="true"] {
            color: inherit !important;
            text-decoration: none !important;
          }
    
          table,
          td {
            color: #000000;
          }
          #u_body a {
            color: #0000ee;
            text-decoration: underline;
          }
          @media (max-width: 480px) {
            #u_content_image_1 .v-src-width {
              width: auto !important;
            }
            #u_content_image_1 .v-src-max-width {
              max-width: 80% !important;
            }
            #u_content_heading_1 .v-container-padding-padding {
              padding: 30px 10px 60px !important;
            }
            #u_content_heading_3 .v-font-size {
              font-size: 23px !important;
            }
            #u_content_text_2 .v-container-padding-padding {
              padding: 10px 20px 60px !important;
            }
            #u_content_image_2 .v-container-padding-padding {
              padding: 60px 0px 0px !important;
            }
            #u_content_heading_2 .v-container-padding-padding {
              padding: 30px 10px 1px !important;
            }
            #u_content_heading_2 .v-text-align {
              text-align: center !important;
            }
            #u_content_text_1 .v-container-padding-padding {
              padding: 10px 20px !important;
            }
            #u_content_text_1 .v-text-align {
              text-align: center !important;
            }
            #u_content_text_3 .v-container-padding-padding {
              padding: 10px 10px 60px !important;
            }
            #u_content_text_3 .v-text-align {
              text-align: center !important;
            }
            #u_content_text_4 .v-container-padding-padding {
              padding: 60px 20px 10px !important;
            }
            #u_content_text_6 .v-container-padding-padding {
              padding: 20px 20px 40px !important;
            }
          }
        </style>
    
        <link
          href="https://fonts.googleapis.com/css?family=Rubik:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:400,700&display=swap"
          rel="stylesheet"
          type="text/css"
        />
      </head>
    
      <body
        class="clean-body u_body"
        style="
          margin: 0;
          padding: 0;
          -webkit-text-size-adjust: 100%;
          background-color: #e6f3ed;
          color: #000000;
        "
      >
        <table
          id="u_body"
          style="
            border-collapse: collapse;
            table-layout: fixed;
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
            vertical-align: top;
            min-width: 320px;
            margin: 0 auto;
            background-color: #fff;
            width: 100%;
          "
          cellpadding="0"
          cellspacing="0"
        >
          <tbody>
            <tr style="vertical-align: top">
              <td
                style="
                  word-break: break-word;
                  border-collapse: collapse !important;
                  vertical-align: top;
                "
              >
                <div
                  class="u-row-container"
                  style="
                    padding: 0px;
                    background-image: url('https://i.postimg.cc/CL9ZjJg1/Proyecto-nuevo-1.png');
                    background-repeat: no-repeat;
                    background-position: center top;
                    background-color: transparent;
                  "
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 600px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                      "
                    >
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 600px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div style="height: 100%; width: 100% !important">
                          <div
                            style="
                              height: 100%;
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                            "
                          >
                            <!--<![endif]-->
                            <table
                              id="u_content_image_1"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 60px 0px 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      width="100%"
                                      cellpadding="0"
                                      cellspacing="0"
                                      border="0"
                                    >
                                      <tr>
                                        <td
                                          class="v-text-align"
                                          style="
                                            padding-right: 0px;
                                            padding-left: 0px;
                                          "
                                          align="center"
                                        >
                                          <img
                                            align="center"
                                            border="0"
                                            src="https://i.postimg.cc/VLDXyXnB/logo.png"
                                            alt="image"
                                            title="image"
                                            style="
                                              outline: none;
                                              text-decoration: none;
                                              -ms-interpolation-mode: bicubic;
                                              clear: both;
                                              display: inline-block !important;
                                              border: none;
                                              height: auto;
                                              float: none;
                                              width: 50%;
                                              max-width: 350px;
                                            "
                                            width="350"
                                            class="v-src-width v-src-max-width"
                                          />
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 600px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                      "
                    >
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 600px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="
                            background-color: #ffffff;
                            height: 100%;
                            width: 100% !important;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        >
                          <div
                            style="
                              height: 100%;
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                              border-radius: 0px;
                              -webkit-border-radius: 0px;
                              -moz-border-radius: 0px;
                            "
                          >
                            <table
                              id="u_content_heading_3"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 60px 10px 1px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <h1
                                      class="v-text-align v-font-size"
                                      style="
                                        margin: 0px;
                                        color: #c79556;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                        font-weight: normal;
                                        font-family: 'Rubik', sans-serif;
                                        font-size: 22px;
                                      "
                                    >
                                      <div>
                                        <strong>HOLA ${user.fullname}</strong>
                                      </div>
                                    </h1>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              id="u_content_text_2"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 50px 60px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        line-height: 160%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 160%">
                                        Se ha solicitado un cambio de contraseña
                                        para nuestra aplicación MuuApp. Si no has
                                        sido tú simplemente ignora este correo
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="padding: 0px; background-color: transparent"
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 600px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                      "
                    >
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 600px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="
                            background-color: #ffffff;
                            height: 100%;
                            width: 100% !important;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        >
                          <!--[if (!mso)&(!IE)]><!-->
                          <div
                            style="
                              height: 100%;
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                              border-radius: 0px;
                              -webkit-border-radius: 0px;
                              -moz-border-radius: 0px;
                            "
                          >
                            <table
                              id="u_content_text_4"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 60px 50px 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        Si no te acuerdas de tu contraseña, haz
                                        click en el botón de abajo, te
                                        redireccionara a una pagina en donde podras
                                        establecer una nueva contraseña.
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px 10px 60px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div class="v-text-align" align="center">
                                      <a
                                        href="https://missaellopez.github.io/muuapp-recovery-password?data=${encodeData}"
                                        target="_blank"
                                        class="v-button"
                                        style="
                                          box-sizing: border-box;
                                          display: inline-block;
                                          font-family: 'Open Sans', sans-serif;
                                          text-decoration: none;
                                          -webkit-text-size-adjust: none;
                                          text-align: center;
                                          color: #ffffff;
                                          background-color: #c79556;
                                          border-radius: 4px;
                                          -webkit-border-radius: 4px;
                                          -moz-border-radius: 4px;
                                          width: 50%;
                                          max-width: 100%;
                                          overflow-wrap: break-word;
                                          word-break: break-word;
                                          word-wrap: break-word;
                                          mso-border-alt: none;
                                        "
                                      >
                                        <span
                                          style="
                                            display: block;
                                            padding: 10px 20px;
                                            line-height: 120%;
                                          "
                                          ><strong
                                            ><span
                                              style="
                                                font-size: 14px;
                                                line-height: 16.8px;
                                              "
                                              >Establecer nueva contraseña</span
                                            ></strong
                                          ></span
                                        >
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              id="u_content_text_4"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 60px 50px 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p style="font-size: 14px; line-height: 140%">
                                        Si el botón de arriba no funciona, haz click
                                        en el siguiente enlace:
                                      </p>
                                      <br />
                                      <a
                                        href="https://missaellopez.github.io/muuapp-recovery-password?data=${encodeData}"
                                        >https://missaellopez.github.io/muuapp-recovery-password?data=${encodeData}</a
                                      >
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <br /><br /><br /><br /><br />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    
                <div
                  class="u-row-container"
                  style="
                    padding: 0px;
                    background-image: url('https://i.postimg.cc/9fKN2652/Proyecto-nuevo-1.png');
                    background-repeat: no-repeat;
                    background-position: center top;
                    background-color: transparent;
                  "
                >
                  <div
                    class="u-row"
                    style="
                      margin: 0 auto;
                      min-width: 320px;
                      max-width: 600px;
                      overflow-wrap: break-word;
                      word-wrap: break-word;
                      word-break: break-word;
                      background-color: transparent;
                    "
                  >
                    <div
                      style="
                        border-collapse: collapse;
                        display: table;
                        width: 100%;
                        height: 100%;
                        background-color: transparent;
                      "
                    >
                      <div
                        class="u-col u-col-100"
                        style="
                          max-width: 320px;
                          min-width: 600px;
                          display: table-cell;
                          vertical-align: top;
                        "
                      >
                        <div
                          style="
                            height: 100%;
                            width: 100% !important;
                            border-radius: 0px;
                            -webkit-border-radius: 0px;
                            -moz-border-radius: 0px;
                          "
                        >
                          <div
                            style="
                              height: 100%;
                              padding: 0px;
                              border-top: 0px solid transparent;
                              border-left: 0px solid transparent;
                              border-right: 0px solid transparent;
                              border-bottom: 0px solid transparent;
                              border-radius: 0px;
                              -webkit-border-radius: 0px;
                              -moz-border-radius: 0px;
                            "
                          >
                            <table
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 110px 10px 20px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #ffffff;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p
                                        style="font-size: 14px; line-height: 140%"
                                      ></p>
                                      <p
                                        style="font-size: 14px; line-height: 140%"
                                      ></p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div align="center">
                                      <div style="display: table; max-width: 187px">
                                        <table
                                          align="left"
                                          border="0"
                                          cellspacing="0"
                                          cellpadding="0"
                                          width="32"
                                          height="32"
                                          style="
                                            width: 32px !important;
                                            height: 32px !important;
                                            display: inline-block;
                                            border-collapse: collapse;
                                            table-layout: fixed;
                                            border-spacing: 0;
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            vertical-align: top;
                                            margin-right: 15px;
                                          "
                                        >
                                          <tbody>
                                            <tr style="vertical-align: top">
                                              <td
                                                align="center"
                                                style="
                                                  border-collapse: collapse;
                                                  vertical-align: top;
                                                "
                                              >
                                                <img
                                                  src="https://i.postimg.cc/PrZ4vSpX/logoh.png"
                                                  alt="Facebook"
                                                  title="Facebook"
                                                  width="100"
                                                  style="
                                                    outline: none;
                                                    text-decoration: none;
                                                    -ms-interpolation-mode: bicubic;
                                                    clear: both;
                                                    display: block;
                                                    border: none;
                                                    height: auto;
                                                    float: none;
                                                  "
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 10px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <table
                                      height="0px"
                                      align="center"
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="81%"
                                      style="
                                        border-collapse: collapse;
                                        table-layout: fixed;
                                        border-spacing: 0;
                                        mso-table-lspace: 0pt;
                                        mso-table-rspace: 0pt;
                                        vertical-align: top;
                                        border-top: 1px solid #ffffff;
                                        -ms-text-size-adjust: 100%;
                                        -webkit-text-size-adjust: 100%;
                                      "
                                    >
                                      <tbody>
                                        <tr style="vertical-align: top">
                                          <td
                                            style="
                                              word-break: break-word;
                                              border-collapse: collapse !important;
                                              vertical-align: top;
                                              font-size: 0px;
                                              line-height: 0px;
                                              mso-line-height-rule: exactly;
                                              -ms-text-size-adjust: 100%;
                                              -webkit-text-size-adjust: 100%;
                                            "
                                          >
                                            <span>&#160;</span>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
    
                            <table
                              id="u_content_text_6"
                              style="font-family: 'Open Sans', sans-serif"
                              role="presentation"
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              border="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="v-container-padding-padding"
                                    style="
                                      overflow-wrap: break-word;
                                      word-break: break-word;
                                      padding: 20px 10px 60px;
                                      font-family: 'Open Sans', sans-serif;
                                    "
                                    align="left"
                                  >
                                    <div
                                      class="v-text-align"
                                      style="
                                        color: #ffffff;
                                        line-height: 140%;
                                        text-align: center;
                                        word-wrap: break-word;
                                      "
                                    >
                                      <p
                                        style="font-size: 14px; line-height: 140%"
                                      ></p>
                                      <p
                                        style="font-size: 14px; line-height: 140%"
                                      ></p>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
    `,
    };

    transporter.sendMail(mailData, (error, info) => {
      if (error) {
        console.log(error);
        res.status(500).send({ msg: "Internal server error" });
      }
      res.status(200).send({ msg: "Mail send", messageId: info.messageId });
    });
  } catch (error) {
    res.status(500).send({ msg: "El correo no ha sido registrado" });
  }
});

const validate = (data) => {
  const schema = joi.object({
    email: joi.string().email().required().label("Email"),
    password: joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

module.exports = router;
