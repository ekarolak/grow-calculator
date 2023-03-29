import React from "react";
import { useState, useEffect } from "react";
import {
  Box,
  Card,
  TextField,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
  Typography,
  Button,
} from "@mui/material";

import {
  SquareRounded,
  ViewInArRounded,
  WindPowerRounded,
  ParkRounded,
  ForestRounded,
  TungstenRounded,
  FluorescentRounded,
  ContentCopyRounded,
} from "@mui/icons-material";
import "./Calc.scss";

const DisplayedItem = ({
  icon,
  title,
  value,
  unit,
  divider = false,
  copyText,
}) =>
  divider ? (
    <Divider />
  ) : (
    <ListItem disablePadding>
      <ListItemButton onClick={(e) => copyText(e.target.innerText)}>
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText
          primary={
            <div>
              {title}{" "}
              <span>
                {value}
                {unit ? "\u00A0" + unit : ""}
              </span>
            </div>
          }
        />
      </ListItemButton>
    </ListItem>
  );

const handleKeyDown = (e) => {
  var charCode = typeof e.which == "undefined" ? e.keyCode : e.which;
  if (
    (charCode < 48 || charCode > 57) &&
    (charCode < 96 || charCode > 105) &&
    charCode !== 9 &&
    charCode !== 37 &&
    charCode !== 39 &&
    e.key !== "Backspace"
  ) {
    e.preventDefault();
  }
};

const Calc = () => {
  const photoSurface = 0.36;
  const autoSurface = 0.2;
  const persistedData = JSON.parse(localStorage.getItem("calcData"));
  const [data, setData] = useState(
    persistedData
      ? {
          ...persistedData,
          alertOpen: false,
        }
      : {
          filter: false,
          width: 0,
          depth: 0,
          height: 0,
          surface: 0,
          volume: 0,
          result: 0,
          photos: 0,
          autos: 0,
          lightLed: 0,
          alertOpen: false,
        }
  );

  const Data = [
    {
      divider: true,
    },
    {
      title: "Powierzchnia uprawy:",
      value: data.surface,
      unit: "m²",
      icon: <SquareRounded />,
    },
    {
      title: "Objętość pomieszczenia:",
      value: data.volume,
      unit: "m³",
      icon: <ViewInArRounded />,
    },
    {
      title: "Minimalna przepustowość wyciągu:",
      value: data.result,
      unit: "m³/h",
      icon: <WindPowerRounded />,
    },
    {
      divider: true,
    },
    {
      title: "Sugerowana moc oświetlenia LED:",
      value: "~ " + data.lightLed + " W",
      icon: <FluorescentRounded />,
    },
    {
      title: "Sugerowana moc oświetlenia HPS:",
      value: "~ " + data.lightLed * 2 + " W",
      icon: <TungstenRounded />,
    },
    {
      divider: true,
    },
    {
      title: "Sugerowana liczba roślin sezonowych:",
      value: data.photos,
      icon: <ParkRounded />,
    },
    {
      title: "Sugerowana liczba roślin automatycznych:",
      value: data.autos,
      icon: <ForestRounded />,
    },
    {
      divider: true,
    },
  ];

  useEffect(() => {
    if (data.width > 1000) data.width = 1000;
    if (data.depth > 1000) data.depth = 1000;
    if (data.height > 1000) data.height = 1000;
    let tempSurface = ((data.width / 100) * data.depth) / 100;
    let tempVolume = (tempSurface * data.height) / 100;
    let tempPhotos = tempSurface / photoSurface;
    let lightLed = tempPhotos * 130;
    if (tempPhotos - Math.floor(tempPhotos) >= 0.79) tempPhotos += 1;
    let tempAutos = tempSurface / autoSurface;
    if (tempAutos - Math.floor(tempAutos) >= 0.79) tempAutos += 1;
    let newData = {
      ...data,
      photos: Math.floor(tempPhotos),
      autos: Math.floor(tempAutos),
      surface: parseFloat(tempSurface.toFixed(2)),
      volume: parseFloat(tempVolume.toFixed(2)),
      result: parseFloat(
        (tempVolume * 45 * (data.filter ? 1.5 : 1)).toFixed(2)
      ),
      lightLed: Math.floor(lightLed),
    };
    setData(newData);
    localStorage.setItem("calcData", JSON.stringify(newData));
  }, [data]);

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setData({
      ...data,
      alertOpen: true,
    });
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setData({
      ...data,
      alertOpen: false,
    });
  };

  return (
    <React.Fragment>
      <Snackbar
        open={data.alertOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Skopiowano do schowka
        </Alert>
      </Snackbar>
      <Box>
        <Card
          className="fan-calc"
          variant="outlined"
          sx={{ minWidth: 320, maxWidth: 500, margin: "30px auto" }}
        >
          <div className="calc-title">
            <Typography variant="h6" component="div">
              Parametry pomieszczenia uprawowego (namiotu)
            </Typography>
          </div>
          <div className="inputs">
            <div>
              <TextField
                id="width"
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1000,
                  },
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                label="Szerokość"
                value={data.width}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setData({ ...data, width: e.target.value })}
              />
            </div>
            <div>
              <TextField
                id="depth"
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1000,
                  },
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                label="Głębokość"
                value={data.depth}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setData({ ...data, depth: e.target.value })}
              />
            </div>
            <div>
              <TextField
                id="height"
                type="number"
                variant="outlined"
                InputProps={{
                  inputProps: {
                    min: 0,
                    max: 1000,
                  },
                  endAdornment: (
                    <InputAdornment position="end">cm</InputAdornment>
                  ),
                }}
                label="Wysokość"
                value={data.height}
                onFocus={(e) => e.target.select()}
                onKeyDown={(e) => handleKeyDown(e)}
                onChange={(e) => setData({ ...data, height: e.target.value })}
              />
            </div>
          </div>
          <div className="chk">
            <FormControlLabel
              control={
                <Checkbox
                  id="filter"
                  checked={data.filter}
                  onChange={(e) =>
                    setData({ ...data, filter: e.target.checked })
                  }
                />
              }
              label="Zaznacz jeśli używasz filtra&nbsp;węglowego"
            />
          </div>
          <div className="output">
            <List id="lista">
              {Data.map((item, index) => (
                <DisplayedItem key={index} copyText={copyText} {...item} />
              ))}
            </List>
          </div>
          <div className="buton">
            <Button
              variant="contained"
              endIcon={<ContentCopyRounded />}
              onClick={(e) =>
                copyText(document.getElementById("lista").innerText)
              }
            >
              Kopiuj wszystko
            </Button>
          </div>
        </Card>
      </Box>
    </React.Fragment>
  );
};

export default Calc;
