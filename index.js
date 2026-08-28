// Saving Local
var darkmode = false;
var Debug_Mode = true;

// Config
var id_to_use = "list";

var var_titel_input = "inputfield_titel";
var var_message_input = "inputfield_message"
var error_prefix = "Fehler erkannt, Grund: "

const titelText = document.getElementById("titelText");
titelText.classList.add("whitemode-text");


let notizen = [];

// Async damit nicht der ganze Prozess zu stoppen droht
async function add_notiz()
{
    // Erstellt Object namens "div"
    const div = document.createElement("div");
    const raw_titel = document.getElementById(var_titel_input);
    const raw_message = document.getElementById(var_message_input);
    const raw_file_message = document.getElementById("file");
    
    // Hilfs Variablen
    var titel = raw_titel.value;
    var message = raw_message.value;
    
    // Verhindert Nullpointer
    if (!killERRORS(titel,message,raw_file_message))
    {
        return;
    }
    const file = raw_file_message.files[0];
    if (file)
    {
        const text = await file.text();
        console.log("Inhalt von " + raw_file_message.value +": "+ text);
        message = text;
    }
    // Fügt Class-Namen hinzu
    div.className = "card";
    
    // Inhalt
    div.innerHTML = `
        <h2>` + titel + `</h2>` +
        `<p>` + message + `</p>` +
        `<button>Mehr Infos</button>`
    
    // Fügt bei der angebenen ID ein DIV hinzu
    document.getElementById(id_to_use).appendChild(div);
    

    const notiz =
    {
        titel: titel,
        message: message
    };
    notizen.push({
        titel: titel,
        message: message
    });

    // Reset
    raw_titel.value = null;
    raw_message.value = null;
    raw_file_message.value = null;
    

}

function saveJSON()
{
    // Erstellt aus dem Array eine Json
    // null,4 -> schöne Einrückung!
    const json = JSON.stringify(notizen,null,4);

    // Erstellt aus der Json eine Datei ähnliche Struktur
    const blob = new Blob([json], 
        {
            // Sagt dem Browser das es eine Json ist
            type: "application/json"
        });
    // Browser erstellt URL für die Datei
    const url = URL.createObjectURL(blob);
    
    // Erstellt ein Element (link)
    const a = document.createElement("a");
    // Verknüpft die URL mit dem Link
    a.href = url;
    // Wählt die Datei an
    a.download = "notizen.json";
    // Startet den Download
    a.click()
    // Entfernt die URL aus dem Speicher
    URL.revokeObjectURL(url);
}

function killERRORS(titel, message, file) {

    // Titel muss immer vorhanden sein
    if (titel == "") {
        console.error(error_prefix + "Es wurde kein Titel angegeben!");
        return false;
    }

    // Weder Message noch Datei vorhanden
    if (message == "" && !file.files[0]) {
        console.error(error_prefix + "Es wurde kein Inhalt angegeben!");
        return false;
    }
    return true;
}


async function loadJSON()
{
    const fileInput = document.getElementById("jsonFile");
    const file = fileInput.files[0];

    if (!file)
    {
        console.error("Es wurde keine JSON zum importieren gefunden, abbruch!");
        return; 
    }
    
    try
    {
        const text = await file.text();
        notizen = JSON.parse(text);

        document.getElementById(id_to_use).innerHTML = "";

        for (const notiz of notizen)
        {
            const div = document.createElement("div");

            // Fügt Class-Namen hinzu
            div.className = "card";
            
            // Inhalt
            div.innerHTML = `
                <h2> ${notiz.titel}</h2>` +
                `<p> ${notiz.message}</p>` +
                `<button>Mehr Infos</button>`
            
            // Fügt bei der angebenen ID ein DIV hinzu
            document.getElementById(id_to_use).appendChild(div);
        }

        if (Debug_Mode) console.log(json); 
    }

    catch(error)
    {
        console.log(error);
    }
}
function current_Time() {
    const jetzt = new Date();
    const stunde = jetzt.getHours();

    switch (stunde) {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
            darkmode = true;
            break;

        default:
            darkmode = false;
            break;
    }

    set_colorMode();
}

// Kleiner Darkmode Switcher
function set_colorMode() {
    const titel = document.getElementById("titelText");
    const untertitel = document.getElementById("untertitel");
    const button = document.getElementById("switchButton");

    if (darkmode) {
        document.body.classList.remove("whitemode");
        document.body.classList.add("darkmode");

        titel.classList.remove("whitemode-text");
        titel.classList.add("darkmode-text");
        
        untertitel.classList.remove("whitemode-text");
        untertitel.classList.add("darkmode-text");

        button.textContent = "🌑";
        if (Debug_Mode) console.log("Darkmode: "+ darkmode);
        darkmode = false;

    } else {
        document.body.classList.remove("darkmode");
        document.body.classList.add("whitemode");

        titel.classList.remove("darkmode-text");
        titel.classList.add("whitemode-text");

        untertitel.classList.add("whitemode-text");
        untertitel.classList.remove("darkmode-text");


        button.textContent = "☀️";

        if (Debug_Mode) console.log("Darkmode: "+ darkmode);
        darkmode = true;
    }
}

current_Time();