import { HighlightOff } from "@mui/icons-material";
import {
  Button,
  createTheme,
  IconButton,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { useRef, useState } from "react";

import "./attach_file.scss";
import axios from "axios";

const themes = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 61, 61)",
    },
  },
});

type VideoInfo = {
  file: File | Blob;
  src: string;
};

export default function AttachFile() {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | undefined>(undefined);
  const [videoWithSubsInfo, setVideoWithSubsInfo] = useState<
    VideoInfo | null | undefined
  >(undefined);

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  return (
    <div className="global-fullscreen-container attach-file-container">
      <input
        ref={hiddenFileInput}
        type="file"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          const nativeEvent = e.nativeEvent.target as HTMLInputElement;
          nativeEvent.value = "";

          if (!file) {
            setVideoInfo(undefined);
          } else {
            /*
            if (file.size / (1024 * 1024) > 25) {
              alert("Arquivo ultrapassou o limite de 25 MB");
              return;
            }
            */

            setVideoInfo(undefined);
            setVideoInfo({
              file,
              src: URL.createObjectURL(file),
            });
          }
        }}
        style={{ display: "none" }}
      />

      <ThemeProvider theme={themes}>
        <div className="title-container">
          <h1>Aplicar Legenda em Vídeo</h1>
          <h4>
            Legende seu vídeo com um dos modelos de IA mais avançados do mercado
          </h4>
        </div>

        <div className="attach-container">
          {(() => {
            if (!!videoWithSubsInfo) {
              return (
                <Button
                  variant="contained"
                  onClick={() => {
                    if (
                      window.confirm(
                        "O vídeo atual com legenda será descartado. Continuar?"
                      )
                    ) {
                      setVideoInfo(undefined);
                      setVideoWithSubsInfo(undefined);
                      hiddenFileInput.current?.click();
                    }
                  }}
                >
                  Usar Novamente
                </Button>
              );
            } else if (!videoInfo) {
              return (
                <Button
                  variant="contained"
                  onClick={() => {
                    hiddenFileInput.current?.click();
                  }}
                >
                  Anexar Vídeo
                </Button>
              );
            } else {
              return (
                <Button
                  variant="contained"
                  onClick={async () => {
                    setVideoWithSubsInfo(null);

                    try {
                      const apiRoute =
                        process.env.REACT_APP_API_ROUTE ||
                        "http://127.0.0.1:8000";
                      const formData = new FormData();
                      formData.append("request_video", videoInfo.file);
                      const response = await axios.post(apiRoute, formData, {
                        responseType: "blob",
                        headers: {
                          "Content-Type": "multipart/form-data",
                        },
                      });

                      setVideoWithSubsInfo({
                        file: response.data,
                        src: URL.createObjectURL(response.data),
                      });
                    } catch (e) {
                      console.log(e);
                      alert("Falha ao tentar aplicar legendas");
                      setVideoWithSubsInfo(undefined);
                    }
                  }}
                  disabled={videoWithSubsInfo !== undefined}
                >
                  Aplicar Legenda
                </Button>
              );
            }
          })()}

          {!!videoInfo && (
            <div className="video-container">
              {videoWithSubsInfo === undefined && (
                <Tooltip title="Remover Vídeo" placement="top-start">
                  <IconButton
                    className="delete-button"
                    color="error"
                    onClick={() => {
                      setVideoInfo(undefined);
                    }}
                  >
                    <HighlightOff />
                  </IconButton>
                </Tooltip>
              )}

              <video key={videoInfo.src} controls>
                <source src={videoInfo.src} type={videoInfo.file.type} />
              </video>
            </div>
          )}
          {!!videoWithSubsInfo && (
            <div className="video-container">
              <video key={videoWithSubsInfo.src} controls>
                <source
                  src={videoWithSubsInfo.src}
                  type={videoWithSubsInfo.file.type}
                />
              </video>
            </div>
          )}
        </div>
      </ThemeProvider>
    </div>
  );
}
