#target illustrator
/*
  TrueType-to-OpenType.jsx
  written by Philipp Glatza, le-tex publishing services GmbH, 2016
  written for Verlag Europa-Lehrmittel, Nourney, Vollmer GmbH & Co. KG
  version 1.0 (2016-12-02)
*/

// Following variables are user editable
var strTTFFontNames = new Array(
  'Univers', 'Univers-Bold', 'Univers-Oblique', 'Univers-BoldOblique',
  'IsoGeradeA', 'IsoKursivA');
var strOTFFontNames = new Array(
  'UniversLTStd', 'UniversLTStd-Bold', 'UniversLTStd-Obl', 'UniversLTStd-BoldObl',
  'NormschriftVELRg-Regular', 'NormschriftVELIt-Italic');

// Following variables are not user editable
var arrFontsMissing= new Array(),
  dlgTitle = "TTF zu OTF",
  intFontsLength= strTTFFontNames.length,
  arrProcessFiles = new Array();

//var originalInteractionLevel = userInteractionLevel;
//userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

Main()

function selectRelevantFiles(folder) {
  if ( sourceFolder != null ) {
    var contents = folder.getFiles();
    for(var c = 0; c < contents.length; c++){
      if(contents[c] instanceof File && RegExp( /\.ai$/i ).test(contents[c].fsName)) {
        arrProcessFiles.push(contents[c]);
      }
      if (contents[c] instanceof Folder) {
        selectRelevantFiles(contents[c]);
      }
    }
  }
}

function Main() {
  findMissingOTFFonts();
  sourceFolder = Folder.selectDialog("Bitte Verzeichnis mit den Adobe Illustrator Dateien auswählen:", "~");
  selectRelevantFiles(sourceFolder)
  for(a=0, z=arrProcessFiles.length; a<z; a++) {
    app.open(arrProcessFiles[a])
    TrueType2OpenType();
    app.activeDocument.save()
    app.activeDocument.close()
  } // for
  alert("Es wurden " + arrProcessFiles.length + " Dateien verarbeitet.", dlgTitle + ": Fertig!")
} // function

function TrueType2OpenType() {
  if( app.documents.length != 0 ) {
    for ( i = 0, j = app.activeDocument.textFrames.length; i < j; i++) {
      var text = app.activeDocument.textFrames[i].textRange.characters;
      try{
        for(t = 0, u = text.length; t < u; t++) {
          for(f = 0; f < intFontsLength; f++) {
            if(text[t].characterAttributes.textFont.name == strTTFFontNames[f]) {
              text[t].characterAttributes.textFont = textFonts.getByName(strOTFFontNames[f])
            } // if
          } // for
        } // for
      } catch(e){} // try
    } // for
  } else {
    alert("Kein Dokument für die Schriftersetzung geöffnet!", dlgTitle + ": Fehler (intern)")
  } // if
} // function


function findMissingOTFFonts() {
  if(strTTFFontNames.length != strOTFFontNames.length) {
    alert("Im Skript stimmt das Mapping von TTF zu OTF nicht. Bitte das Skript ordnungsgemäß konfigurieren.", dlgTitle + ": Fehler (intern)")
  }
  for(i = 0, j = strOTFFontNames.length; i<j; i++) {
    try{
      app.textFonts.getByName(strOTFFontNames[i])
    } catch(e) {
      arrFontsMissing.push(strOTFFontNames[i])
    } // try
  } // for
  if(arrFontsMissing.length) {
    alert("Folgende im Skript konfigurierte OTF-Schriften konnten nicht gefunden werden (mglw. im System nicht installiert): " + arrFontsMissing.join(", "), dlgTitle + ": Schrift nicht gefunden")
  }
} // function

//userInteractionLevel = originalInteractionLevel;
