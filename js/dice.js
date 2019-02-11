    var settingsCookie = null;
    var diceTimer = null;
    var diceSpeed = 0;
    var SPEED = {
      ACC: 0,
      HOLD: 1,
      BRAKE: 2
    };
    var speedMode = SPEED.ACC;
    var settings = {
      predefinedIndex: 0,
      customLetters: ""
    }


    function setup() {
      orientationChanged();
      fillPredefined();
      settingsCookie = new Cookie("DiceSettings");
      if (settingsCookie.get()) {
        try {
          settings = eval("new Object({" + settingsCookie.get() + "})");
        } catch (e) {
          debug("LoadingSettings failed: " + e);
        }
      }
      $("DiceSection").onmousedown = startRoll;
      $("DiceSection").onmouseup = stopRoll;
      $("DiceSection").ontouchstart = function (event) {
        event.preventDefault();
        startRoll();
      };
      $("DiceSection").ontouchend = function (event) {
        if (event.touches.length > 0) {
          return;
        }
        event.preventDefault();
        stopRoll();
      };

      customChanged();
      startRoll();
      stopRoll();
      $("RollHint").style.visibility = "visible";
    }

    function fillPredefined() {
      for (var i = 0; i < predefined.length; i++) {
        var option = document.createElement("option");
        option.value = i;
        option.innerHTML = predefined[i].name;
        $("CustomSelect").appendChild(option);
        option = document.createElement("option");
        option.value = i;
        option.innerHTML = predefined[i].name;
        $("CustomLettersSelect").appendChild(option);
      }
    }

    function startRoll() {
      $("RollHint").style.visibility = "hidden";
      setDiceSpeed(200);
      speedMode = SPEED.ACC;
      roll();
    }

    function roll() {
      var customLetters = settings.customLetters;
      if (settings.predefinedIndex >= 0) {
        customLetters = predefined[settings.predefinedIndex].value;
      }
      if (diceTimer) {
        window.clearTimeout(diceTimer);
      }
      var ch = String.fromCharCode(65 + Math.random() * 26);
      if (customLetters.length > 0) {
        ch = customLetters.charAt(Math.random() * customLetters.length);
      }
      $("Dice").innerHTML = ch;
      switch (speedMode) {
      case SPEED.ACC:
        setDiceSpeed(diceSpeed - 25);
        if (diceSpeed < 50) {
          setDiceSpeed(50);
          speedMode = SPEED.HOLD;
        }
        break;
      case SPEED.BRAKE:
        setDiceSpeed(diceSpeed + 25);
        if (diceSpeed > 200) {
          stopRolling();
          return;
        }
        break;
      }
      diceTimer = setTimeout(roll, diceSpeed);
    }

    function stopRoll() {
      setDiceSpeed(50);
      speedMode = SPEED.BRAKE;
    }

    function stopRolling() {
      if (diceTimer) {
        window.clearTimeout(diceTimer);
      }
      setDiceSpeed(200);
      speedMode = SPEED.HOLD;
      diceTimer = null;
      $("RollHistory").innerHTML = $("RollHistory").innerHTML + $("Dice").innerHTML + " ";
    }

    function setDiceSpeed(speed) {
      diceSpeed = speed;
      if (speed > 0) {
        $("DiceBackground").style.opacity = (200 - speed) / 200.0;
      } else {
        $("DiceBackground").style.opacity = 0.0;
      }
    }

    function clearHistory() {
      $("RollHistory").innerHTML = "&nbsp;";
    }

    function showSetup() {
      $("Setup").style.display = "block";
      $("ShowSetup").style.display = "none";
    }

    function closeSetup() {
      $("Setup").style.display = "none";
      $("ShowSetup").style.display = "";
    }

    function customLettersSelectChanged() {
      var index = parseInt($("CustomLettersSelect").value);
      if (index >= 0) {
        settings.customLetters = predefined[index].value;
      }
      customChanged();
      $("CustomLettersSelect").selectedIndex = 0;
      setTimeout(function () {
        $("CustomLettersSelect").selectedIndex = 0;
      }, 100);
    }

    function customSelectChanged() {
      settings.predefinedIndex = parseInt($("CustomSelect").value);
      customChanged();
    }

    function customChanged() {
      $("CustomLetters").value = settings.customLetters;
      var index = settings.predefinedIndex;
      $("CustomSelect").value = index;
      if (index == -1) {
        $("CustomHint").innerHTML = "Roll these letter:";
        $("CustomSection").style.display = "block";
      } else {
        $("CustomHint").innerHTML = "";
        $("CustomSection").style.display = "none";
      }
      changeLetters();
    }

    function changeLetters() {
      settings.customLetters = $("CustomLetters").value;
      settings.customLetters = settings.customLetters.replace(/\s/g, "");
      settings.customLetters = settings.customLetters.toUpperCase();
      $("CustomLetters").value = settings.customLetters;
      saveSettings();
      window.scrollTo(0, 0);
    }

    function saveSettings() {
      var text = window.JSON.stringify(settings);
      settingsCookie.store(text);
    }

    function tellFriend() {
      var body = "Hi,<br><br>I just stumbled upon this iPhone letter dice application:" +
        "<br><br>http://letterdice.speedymarks.com<br><br>" +
        "Roll the dice for a random letter." +
        "<br><br>Best regards";
      window.open("mailto:?subject=Letter Dice on the iPhone&body=" + body, "_self");
    }

    function $(id) {
      return document.getElementById(id);
    }

    function orientationChanged() {
      if (window.orientation != undefined) {
        landscape = window.orientation != 0 && window.orientation != 180;
      } else {
        landscape = window.innerWidth > window.innerHeight;
      }
      setTimeout(function () {
        window.scrollTo(0, 1)
      }, 1);
    }

    function debug(msg) {
      var e = $("Debug");
      e.innerHTML += msg + "<br>";
    }
