let dataUid;
let dataSid;
let colors={
    "error":"#e74c3c",
    "success":"#2ecc71",
    "progress":"#3498db",
    "unknown":"#f1c40f"
}

function amazonLogin(){
    window.open("https://na.account.amazon.com/ap/oa?client_id=amzn1.application-oa2-client.9d2f00467db14692b9044d3fa0714485&redirect_uri=https%3A%2F%2Fplay.mobilelegends.com%2Fevents%2Famazonlinkage%2Findex.html&response_type=token&language=&ui_locales=&scope=profile%20prime%3Abenefit_status","_self");
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkFormat(){
    var uid = document.getElementById("userserver").value;
    var match = uid.match(/\d+ +\d+/);
    if(match!=null){
        if(match.length>0){
            let split = match[0].split(' ');
            let countSplit = split.length;
            let sid = split[countSplit-1];
            let uid = split[0];
            dataUid = uid;
            dataSid = sid;
            document.getElementById("userserver").value=uid + " " + sid;
        }
    }
    
}

function apiStatusChange(color,responseText){
    document.querySelector("#apistatusresp").innerText = responseText;
    document.querySelector("#apistatusresp").style.color=color;
}

function sendVc(btn){
    apiStatusChange(colors.progress,"Sending VC...");
    btn.style.display="none";
    sendApi(btn,"sendvc",{
        "roleId":dataUid,
        "zoneId":dataSid
    })
}
async function sendApi(btn,sendas,data){
    let postReq;
    let formData = new FormData();
    for(let d in data){
        formData.append(d,data[d]);
    }
    switch(sendas){
        case "sendvc":
            postReq = await axios.post('https://api.mobilelegends.com/base/sendVc', formData);
            btn.style.display="block"; 
            console.log(postReq.data);
            
            let resp = "No response!";
            let color = colors.progress;
            switch(postReq.data.code){
                case 0:
                    resp = "Sent successfully!";
                    color = colors.success;
                    break;
                case -20006:
                    resp = "VC Sent too fast!"
                    color = colors.error;
                    break;
                case -20012:
                    resp = "Illegal District Service/Invalid Server"
                    color = colors.unknown;
                    break;
            }
            apiStatusChange(color,resp);
        break;
        case "sendclaim":
            postReq = await axios.post('https://api.mobilelegends.com/events/amazon/exchangeAmazonReward', formData);
        break;
        case "sendlogin":
            postReq = await axios.post('https://api.mobilelegends.com/base/login', formData);
        break;
    }
    
}