module.exports.ChatbotReply = function(message){
    this.University = "Veer Narmad South Gujarat University";
    this.Location = "Surat, Gujarat";
    this.Faculties = ["Engineering", "Science", "Arts", "Commerce", "IT", "Law"];
    this.Courses = ["B.Tech","B.sc","M.Tech", "M.Sc", "MBA", "B.Com","M.Com", "PhD"];

    message = message.toLowerCase();

    if (message.indexOf("hi") > -1 || message.indexOf("hello") > -1 || message.indexOf("welcome") > -1) {
        return "Hi! Welcome to VNSGU University";
    }
    else if (message.indexOf("name") > -1 && message.indexOf("university") > -1) {
        return "The university's name is " + this.University;
    }
    else if (message.indexOf("where") > -1 && message.indexOf("located") > -1) {
        return this.University + " is located in " + this.Location;
    }
    else if (message.indexOf("faculty") > -1 || message.indexOf("faculties") > -1) {
        return "The faculties available are: " + this.Faculties.join(", ");
    }
    else if (message.indexOf("courses") > -1 || message.indexOf("programs") > -1) {
        return "We offer the following courses: " + this.Courses.join(", ");
    }
    else if (message.indexOf("course") > -1 && message.indexOf("engineering") > -1) {
        return "The B.Tech and M.Tech programs are available in the Engineering faculty.";
    }
    else if (message.indexOf("course") > -1 && message.indexOf("science") > -1) {
        return "The B.sc and M.sc in Math,chemistry and physics programs are available in the Science faculty.";
    }
    else if (message.indexOf("course") > -1 && message.indexOf("it") > -1) {
        return "The B.sc and M.sc in it programs are available in the Computer and I.T faculty.";
    } 
    return "Sorry, I didn't understand that. Could you ask something else about the university?";
};

    
