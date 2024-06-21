function Listing(user, pets) {
  this.user = user;
  this.pets = pets;
}

function Pet(petName, color, species, image, extra, description = "", initiate = "") {
  this.petName = petName;
  this.color = color;
  this.species = species;
  this.image = image;
  this.extra = extra;
  this.description = description;
  this.initiate = initiate

  if (this.extra == null) {
    this.extra = ""
  }
}

var allListings = [];

function parseListing() {
  var listArr = []; // Array for storing pet objects

  var rawListing = document.getElementById("userListing").value; // Get data from textarea

  if (rawListing.length == 0) {
    alert("Enter a listing first!");
  }
  else {
    rawListing = rawListing.replace(/^\s*$(?:\r\n?|\n)/gm, ""); // Remove empty spaces
    rawListing = rawListing.split("\n"); // Split listing into lines
    rawListing = rawListing.filter(v => v !== ""); // Remove empty spaces

    if (rawListing.length > 4) {
      alert("It looks like you added too many pets. Edit the listing and try again.");
    }
    else {
      for (let i = 0; i < rawListing.length; i++) { // Iterate through lines

        if (rawListing[i][0] == "@") { // Get username
          var userName = rawListing[i].slice(1);
        }
        else if (rawListing[i].match(/^\s*(l|listing):?$/gim)) { // Ignore "Listing:" line 
        }
        else { // Hopefully here there be pets
          var regExp = /\([^)]+\)/; // Identify area between parentheses
          var extra = regExp.exec(rawListing[i]); // Sometimes there are notes in parentheses like (RW) or (can't initiate), extract those
          var petArr = rawListing[i].replace(" " + extra, "").split(" "); // Separate components of listing
          var petName = petArr[0]; // Name of pet is always first
          petArr = petArr.slice(2); // Followed by separator between "petname" and "color species" - usually "-", "/", or "the"
          var color = petArr.slice(0, petArr.length - 1).join(" "); // Pet color is always in middle, but sometimes is multiple words, like royal boy/elderly girl
          var species = petArr[petArr.length - 1]; // Species name is always last
          var image = "http://pets.neopets.com/cpn/" + petName + "/1/7.png"; // Add pet image URL
          listArr.push(new Pet(petName, color, species, image, extra)); // Add pet to user's listing
        }

      }

      document.getElementById("userListing").value = ""; // Clear textarea
      previewListing(new Listing(userName, listArr)); // Set up to preview listing in webpage

    }
  }
}

function previewListing(fullListing) {
  var user = fullListing.user;
  var pets = fullListing.pets;

  var container = document.getElementById("showListing"); // To add preview
  var cssString = `<br><center><form id="userInput" style="width: 25%"><fieldset><input type="text" id=userName" name="userName" value="${user}" style="margin-bottom: 0px"></fieldset></form></center><br>`; // Starting CSS preview

  for (let i = 0; i < pets.length; i++) {
    cssString += `<div id="subShowListing"><form id="form${i}">
      <fieldset>
      
        <div id="subForm">
        <label for="petName">Pet Name:</label>
        <input type="text" id="petName" name="petName${i}" value="${pets[i].petName}">
        <label for="petColor">Color:</label>
        <input type="text" id="petColor" name="petColor${i}" value="${pets[i].color}">
        <label for="petSpecies">Species:</label>
        <input type="text" id="petSpecies" name="petSpecies${i}"  value="${pets[i].species}">
        <label for="petExtra">Extra details:</label>
        <input type="text" id="petExtra" name="petExtra${i}" placeholder="(Optional) (RW), (HSD), etc." value="${pets[i].extra}">
        <label for="petDescription">Description:</label>
        <input type="text" id="petDescription" name="petDescription${i}" placeholder="(Optional) Jokes, etc."></div>

      <div id="subForm">
	  
        <label for="initiate">Can't initiate?</label>
	    <input type="checkbox" id="check${i}">
        
        <label for="custom${i}">Custom?</label>
        <select name="custom${i}" id="custom${i}">
	  
		  <option value="blank"></option>
		  <option value="NP Custom">NP Custom</option>
		  <option value="Unlimited NP Custom">UL NP Custom</option>
		  <option value="Fountain Faerie Custom">FFQ</option>
		  <option value="Premium Perk Custom">PP</option>
    </select>
        
      </div>
      
      </fieldset>
    </form><img src="${pets[i].image}" id="showImage${i}"></div><br>` // Add image to preview

    $(`body`).on('change', `#custom${i}`, function() { // For detecting changes in custom dropdown menu
      if ($(this).val() != 'blank') { // If not going with default pet listing
        $("form").find(`input[name=petName${i}]`).val($(this).val());
        $("form").find(`input[name=petColor${i}]`).val("");
        $("form").find(`input[name=petSpecies${i}]`).val("");
        $("form").find(`input[name=petExtra${i}]`).val("");
        switch ($(this).val()) {
          case "NP Custom":
            $("form").find(`input[name=petExtra${i}]`).val("# NP/type of morph/paint");
            pets[i].image = "https://images.neopets.com/desert/desert_sc/bag_o_points.gif";
            break
          case "Unlimited NP Custom":
            pets[i].image = "https://images.neopets.com/common/bag_of_np.gif";
            break
          case "Fountain Faerie Custom":
            pets[i].image = "https://images.neopets.com/art/faeries/rainbowfountain18.gif";
            break
          case "Premium Perk Custom":
            pets[i].image = "https://images.neopets.com/premium/2023/icon-changepet.png";
            break
        }
      }
      else { // Otherwise, reset to default pet listing
        $("form").find(`input[name=petName${i}]`).val(`${pets[i].petName}`);
        $("form").find(`input[name=petColor${i}]`).val(`${pets[i].color}`);
        $("form").find(`input[name=petSpecies${i}]`).val(`${pets[i].species}`);
        $("form").find(`input[name=petExtra${i}]`).val(`${pets[i].extra}`);
        pets[i].image = "http://pets.neopets.com/cpn/" + pets[i].petName + "/1/7.png";
      }
      $(`#showImage${i}`).attr("src", pets[i].image); // Update image
    });

  }
  cssString += `<center><button id="addListing" onclick="addListing()">Add Listing</button></center>` // Button for finalizing listing
  container.innerHTML = cssString; // Updating CSS
}

function addListing() {
  var petsList = [];
  var formList = document.getElementsByTagName("form"); // How many pets?
  var user = document.querySelector("input[name=userName]").value;

  for (let i = 0; i < formList.length - 1; i++) { // For the 1-2 pets
    var name = $("form").find(`input[name=petName${i}]`).val();
    var color = $("form").find(`input[name=petColor${i}]`).val();
    var species = $("form").find(`input[name=petSpecies${i}]`).val();
    var image = $(`#showImage${i}`).attr("src");
    var extra = $("form").find(`input[name=petExtra${i}]`).val();
    var description = $("form").find(`input[name=petDescription${i}`).val();

    if ($(`#check${i}`).is(":checked")) { // For checking transfer initiating checkbox
      var init = '+';
    }
    else {
      var init = ""
    }
    petsList.push(new Pet(name, color, species, image, extra, description, init)); // Store pet
  }

  allListings.push(new Listing(user, petsList)); // Add listing under username to total list
  var container = document.getElementById("showListing"); // To delete forms/add confirmation message
  container.innerHTML = `<br><center>Listing added. Add another in the listing box or generate petpage if done.<br>
<br><button id="genPetpage" onclick="genPetpage()">Generate Petpage</button></center>`

}

function genPetpage() {
  var pageFormat = $("#template").val(); // Select template based on dropdown menu
  var petPageTemplate = "";
  var pot = "";

  if (pageFormat == "spensy") {
    petPageTemplate = `<style>
      body {
      	background: #aaa;
      }
      .sf, table {
      	visibility: hidden;
      }
      table div, div table {
      	font: 9px verdana;
      	visibility: visible;
      }
      table {
      	background-color: transparent;
      	text-align: center;
        width: 100%;
        table-layout: fixed;
      }

      td img {
        width: 100%;
      }
      
      .content {
      	background: #fff;
      	width: 850px;
      	height: auto;
      	margin-top: 20px !important;
      	padding: 35px;
      	margin: auto;
      	text-align: justify;
      	overflow: auto;
      }
      p, .medText, font, body, div, tr, td, table {
      	color: #444;
      	font: 14px century gothic;
      }
      a:link, a:visited {
      	text-transform: uppercase;
      	font: 9px monospace;
      	color: #408ec6;
      	text-decoration: none;
      	font-weight: 700 !important;
      }
      a:hover {
      	color: #7a2048;
      	font-weight: 700 !important;
      }
      b {
      	color: #408ec6;
      	font: 25px century gothic;
      	letter-spacing: 0;
      	font-weight: 700;
      }
      i {
      	font: italic 10pt georgia;
      	color: #7a2048;
      	letter-spacing: -1px;
      }
      h1 {
      	font: 40px century gothic;
      	font-weight: 700 !important;
      	color: #7a2048;
      	text-align: center;
      	letter-spacing: -2px;
      	text-transform: uppercase;
      	margin-top: 10px;
      	margin-bottom: 10px;
      	font-style: italic;
      }
      h2 {
      	font: bold 58px century gothic;
      	color: #1e2761;
      	text-align: center;
      	text-transform: uppercase;
      	letter-spacing: -3px;
      	margin-bottom: 15px;
      	font-style: italic;
      }
      .pah {
      	margin-top: 0px;
      	margin-bottom: 0px;
      	background-color: #fff;
      	text-align: center;
      }
      .col {
      	width: 20%;
      	font-size: 14px;
      	padding: 5px;
      	text-align: center;
      }
      </style><div class="content">
      
      <h2>Pet Auction House</h2>
      
      <center>
      → <a href="//www.neopets.com/~Cheesy">click for full PAH Rules</a> ←
      <br>( <a href="//www.neopets.com/userlookup.phtml?user=mizitch">coding by mizitch</a> )
	  <br>( <a href="//www.neopets.com/userlookup.phtml?user=gracesneos">PAH generator by gracesneos</a> )
      </center><br><br><hr><br><h1>Host Rules</h1>
      <ul><li>Your rule</li>
      <li>Your rule</li>
      <li>Your rule</li>
      <li>Your rule</li>
      
      </ul><center><b>KEY:</b><br>
      ★ = Whatever you want this symbol to mean
      <br>
      + = Can't initiate transfer
      <br><br><hr><br></center>
      
      <h1>the pot</h1>
      
      
      <div class="pah">
      
      REPLACEMENT
      
      </div>
      </div>`

    for (let i = 0; i < allListings.length; i++) {
      pot += `<table width="100%" cellpadding="1" cellspacing="1"><tr>`;
      var petLs = allListings[i].pets;
      for (let j = 0; j < petLs.length; j++) {
        pot += `<td class="col"><img src="${petLs[j].image}"><br><b>${petLs[j].petName} ${petLs[j].initiate}</b>
<br><b style="font-size: 16px">${petLs[j].color} ${petLs[j].species} ${petLs[j].extra} </b><br>${petLs[j].description}</td>

`
      }
      pot += `</tr></table><h4>@${allListings[i].user}</h4>
      
      
      `;
    }
  }
  else {
    petPageTemplate = `<style>
.sf, table {
	display: none;
}
body {
	background: url("http://i.imgur.com/2tGxauh.png") fixed;
	font-family: Open Sans,Trebuchet MS,calibri;
	font-size: 12pt;
}
p {
	padding-left: 20px;
	padding-right: 20px;
}
#simplebox {
	width: 60%;
	left: 20%;
	border: 1px solid #eee;
	padding: 8px;
	background: white;
}
h1 {
	font-family: century gothic,didot;
	font-size: 25pt;
	color: #4B666C;
	border-bottom: 2px solid #4B666C;
}
blockquote {
	color: #333;
	font-size: 11pt;
	font-family: calibri;
	background-color: #E6DABE;
	border: 2px solid #B6A695;
	padding: 10px;
}
#notepad {
	bottom: 0;
	width: 20%;
	left: 26%;
	height: 10%;
	z-index: 4;
	background: #ccc;
}
#simplebox b {
	color: #818589;
}
#simplebox i {
	color: #818589;
}
a:link, a:visited {
	color: #207BB8;
	text-decoration: none;
}
a:hover {
	color: #323533;
}
.banner {
	width: 95%;
	display: block;
	margin-left: auto;
	margin-right: auto;
}
.pet {
	border: 3px solid #817D76;
	margin-left: 4%;
	margin-right: 5%;
	float: left;
	width: 39%;
}
.petname {
	margin-left: 4%;
	margin-right: 5%;
	float: left;
	width: 40%;
	font-size: 15pt;
}
h2 {
	font-family: "Copperplate","Palatino Linotype","Book Antiqua",Palatino,serif;
	color: #36A88B;
	font-size: 20px;
}
h3 {
	background: #6C7464;
	width: 94%;
	margin-left: 2%;
	margin-right: 2%;
	text-align: center;
	color: #fff;
	padding: 1%;
	border-bottom: 5px solid #182126;
}
h4 {
	font-size: 18pt;
}
</style><div id="notepad" style="position: fixed;">

<b>Keep Notes here!</b><br>
<textarea style="width: 100%; height: 80%;">
Pets I want to bid on:
</textarea>
</div>
<div id="simplebox" style="border-radius: 3px; position: relative;">



<img src="BANNERURL" class="banner"> 

<center>
<img src="http://i.imgur.com/BfdxOC0.png"><br><br><h4>Your Host Today is: @#OWNER<br>
Guide to PAHs → <a href="/~krouth">HERE</a><br>
+ = Can't initiate a transfer
</h4></center>

<img src="http://i.imgur.com/WtyB6VA.png" class="banner"><p>
</p><ul>RULESHERE
</ul><br><br><img src="http://i.imgur.com/1gCg8d8.png" class="banner"><br><br><center> 

REPLACEMENT

</center>


<h1>Credit </h1> 

<center>
Coding/Graphics by Sunny @ <a href="/~Protester">Resource</a>, specifically for distribution on <a href="/~bydz">Bydz's PAH Resource Page</a>.<br>
Petpage generated with gracesneos' generator.<br><br></center> 

 </div> 

<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>`;
    switch (pageFormat) {
      case "1p":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>If a listing only has 1 valid bidder (the person, not the pets they are bidding, one person can not force a trade), they may pass.</li>
<li>If a listing has 2 valid bidders, they must trade.</li>
<li>BN/VBN, Basics, Compounds, Uncapped and 2/3C pets are invalid bids.</li>`).replace("BANNERURL", "http://i.imgur.com/wAOrFPI.png");
        break;
      case "2p":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>If a listing only has 1 or 2 valid bidders (the person, not the pets they are bidding, one person can not force a trade), they may pass</li>
<li>If a listing has 3 or more valid bidders, they must trade</li>
<li>BN/VBN, Basics, Compounds, Uncapped and 2/3C pets are invalid bids.</li>`).replace("BANNERURL", "http://i.imgur.com/4dAn3NA.png");
        break;
      case "frenzy":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>Validity of bids does not matter, listers may pass no matter what, people may bid on bids and bid with listed pets, have at it!</li>`).replace("BANNERURL", "http://i.imgur.com/UFTa3ZE.png");
        break;
      case "nopass":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>If a listing has any valid bids, they must trade</li>
<li>Bidders may offer a free pass if they want</li>
<li>BN/VBN, Basics, Compounds, Uncapped and 2/3C pets are invalid bids.</li>`).replace("BANNERURL", "http://i.imgur.com/w42d6Fj.png");
        break;
      case "spicy":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>If a listing only has valid bids on one pet, they must trade that pet</li>
<li>If a listing has valid bids on both pets, they must trade one pet</li>
<li>One pet listed alone is a no-pass, any valid bids will force a trade</li>
<li>BN/VBN, Basics, Compounds, Uncapped and 2/3C pets are invalid bids.</li>`).replace("BANNERURL", "http://i.imgur.com/t1saCWJ.png");
        break;
      case "half":
        petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>If a listing only has valid bids on one pet, they may pass on both</li>
<li>If a listing has valid bids on both pets, they may pass on one</li>
<li>One pet listed alone is a no-pass, any valid bids will force a trade</li>
<li>BN/VBN, Basics, Compounds, Uncapped and 2/3C pets are invalid bids.</li>`).replace("BANNERURL", "http://i.imgur.com/QmeMK1x.png");
        break;
	  case "underrated":
		petPageTemplate = petPageTemplate.replace("RULESHERE", `<li>Typical variant rules (H&H, spicy, no-pass, etc.) still apply.</li>
		  <li>You may not list:</li>
		  <ul>
		  	<li>Colors:</li>
		  	<ul>
		  		<li>Plushie</li>
		  		<li>Robot</li>
		  		<li>Burlap</li>
		 	 	<li>Usuki (Boy/Girl)</li>
			  	<li>Valentine</li>
		 	 	<li>Alien</li>
		 	 	<li>MSP</li>
		  		<li>UCs</li>
		  	</ul>
		  	<li>Species</li>
		  	<ul>
		  		<li>Draik</li>
		  		<li>Krawk</li>
		  	</ul>
		  	<li>Specific Cases</li>
		  	<ul>
		  		<li>Toy: Kougra, Lupe, Draik, Poogle</li>
		  		<li>Pastel: Kau, Ixi, Aisha, Poogle, Usul</li>
		  		<li>Maraquan: Lutari, Cybunny, Kiko, Gelert, Vandagyre</li>
		  	</ul>
		  	<li>Others</li>
		  	<ul>
		  		<li>RN/RW/Pronounceable 4Ls</li>
		  		<li>VWN-WN Y1-Y3 pets</li>
		 	 	<li>PP/FFQ/Customs over 1m</li>
			  	<li>Battledome pets over 200 HSD</li>
			  	<li>2-3C pets</li>
		  	</ul>
		  </ul>
		  <li>You may list:</li>
		  <ul>
		  	<li>DN-VWN</li>
		  	<li>Basics</li>
		  	<li>Uncapped</li>
		  	<li>BN BDs</li>
		  	<li>Any other color/species</li>
		  </ul>
		  <li>Only the LISTERS are restricted in what they put in the pot, BIDDING IS NOT RESTRICTED!</li>`).replace("BANNERURL", "http://i.imgur.com/O7Hcj4t.png");
		break
		
    }
    for (let i = 0; i < allListings.length; i++) {
      var petLs = allListings[i].pets;
      for (let j = 0; j < petLs.length; j++) {
        pot += `<img src="${petLs[j].image}" class="pet">`
      }
      pot += `<br style="clear: both;"><br>`
      for (let j = 0; j < petLs.length; j++) {
        pot += `<div class="petname">
                <b>${petLs[j].petName} - ${petLs[j].color} ${petLs[j].species} ${petLs[j].extra} ${petLs[j].initiate}</b><br>
                ${petLs[j].description}
                
                </div> `
      }
      pot += `<br style="clear: both;"><br><h3>@${allListings[i].user}</h3> 
      
      
      `;
    }
  }
  
  newTemplate = petPageTemplate.replace("REPLACEMENT", pot); // Add listings to template
  var container = document.getElementById("showListing");
  container.innerHTML = `<b>Template:</b><br><textarea id="showCode">hi</textarea><br>
  <center>If you want, select a different template and push the button to regenerate the petpage.
  <br><br><button id="genPetpage" onclick="genPetpage()">Regenerate Petpage</button></center>`
  $("#showCode").val(`${newTemplate}`);

}
