import { DownloadForOffline, HighlightOff } from "@mui/icons-material";
import {
  Button,
  createTheme,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Tooltip,
} from "@mui/material";
import { useRef, useState } from "react";

import "./attach_file.scss";
import { FileInfo, Language, languagesDict } from "../types";
import { getTranscription, segmentsToVttFileInfo } from "../utils";

const themes = createTheme({
  palette: {
    primary: {
      main: "rgb(255, 61, 61)",
    },
    secondary: {
      main: "rgb(255, 255, 255)",
    },
  },
});

export default function AttachFile() {
  const [videoInfo, setVideoInfo] = useState<FileInfo | undefined>(undefined);
  const [subtitlesInfo, setSubtitlesInfo] = useState<
    FileInfo | null | undefined
  >(undefined);
  const [language, setLanguage] = useState<Language | "auto">("auto");

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
          <div className="options-container">
            {(() => {
              if (!videoInfo) {
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
                      if (
                        !!subtitlesInfo &&
                        !window.confirm(
                          "As legendas atuais serão perdidas com esta ação. Continuar?"
                        )
                      )
                        return;

                      setSubtitlesInfo(null);

                      try {
                        const result = await getTranscription(
                          videoInfo.file,
                          language
                        );
                        console.log(result);

                        setSubtitlesInfo(
                          segmentsToVttFileInfo(result.segments)
                        );
                      } catch (e: any) {
                        console.log(e);
                        alert(
                          e.response?.data?.message ||
                            "Falha ao tentar aplicar legendas"
                        );

                        setSubtitlesInfo(undefined);
                      }
                    }}
                    disabled={subtitlesInfo === null}
                  >
                    Aplicar Legenda
                  </Button>
                );
              }
            })()}

            <FormControl variant="outlined" className="select">
              <InputLabel id="language-select-label">Idioma</InputLabel>
              <Select
                labelId="language-select-label"
                value={language}
                label="Idioma"
                onChange={(e) => {
                  setLanguage(e.target.value as Language);
                }}
                inputProps={{ readOnly: subtitlesInfo === null }}
              >
                {[["auto", "Detectar Automaticamente"]]
                  .concat(Object.entries(languagesDict))
                  .map(([key, value]) => {
                    return (
                      <MenuItem key={key} value={key}>
                        {value}
                      </MenuItem>
                    );
                  })}
              </Select>
            </FormControl>
          </div>

          <div className="videos-container">
            {!!videoInfo && (
              <div className="video-container">
                <div className="icons-container">
                  <Tooltip title="Remover Vídeo" placement="top-start">
                    <IconButton
                      className="icon"
                      color="error"
                      disabled={subtitlesInfo === null}
                      onClick={() => {
                        if (
                          !subtitlesInfo ||
                          window.confirm(
                            "As legendas atuais serão perdias com esta ação. Continuar?"
                          )
                        ) {
                          setVideoInfo(undefined);
                          setSubtitlesInfo(undefined);
                        }
                      }}
                    >
                      <HighlightOff />
                    </IconButton>
                  </Tooltip>
                  {!!subtitlesInfo && (
                    <Tooltip title="Baixar Legendas" placement="top-start">
                      <IconButton
                        className="icon"
                        color="secondary"
                        onClick={() => {
                          // setVideoInfo(undefined);
                          const link = document.createElement("a");
                          link.href = subtitlesInfo.src;
                          link.download = "subs.vtt";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <DownloadForOffline />
                      </IconButton>
                    </Tooltip>
                  )}
                </div>

                <video key={videoInfo.src} controls>
                  <source src={videoInfo.src} type={videoInfo.file.type} />
                  {!!subtitlesInfo && (
                    <track src={subtitlesInfo.src} kind="subtitles" default />
                  )}
                </video>
              </div>
            )}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
