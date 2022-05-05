
// Focus div based on nav button click
function focuser(divClick){
    var activeDiv = document.getElementsByClassName("active")
    var activeDivArr = Array.from(activeDiv)
    activeDivArr.forEach(div => {
        div.setAttribute("class","hidden")
    });
    document.getElementById(divClick).setAttribute("class","active")
}


// Flip one coin and show coin image to match result when button clicked
const coin = document.getElementById("coin")
// Add event listener for coin button
			coin.addEventListener("click", flipCoin)
			function flipCoin() {
                fetch('http://localhost:3000/app/flip/', {mode: 'cors'})
  				.then(function(response) {
    			  return response.json();
  				})
				.then(function(result) {
					console.log(result);
                    
					document.getElementById("result").innerHTML = result.flip;
					document.getElementById("quarter").setAttribute("src", "/assets/img/"+result.flip+".png");
                    document.getElementById("quarter").setAttribute("class", "smallcoin")
					
				})
			}
// Flip multiple coins and show coin images in table as well as summary results
function tableCreate(flipsArr){
    let body = document.getElementById("tbl");
    let tbl  = document.createElement('table');
    let tblH = tbl.insertRow();
    let cell = document.createElement("th");
    cell.innerHTML = "Flip Result";
    tblH.appendChild(cell);
    let cell1 = document.createElement("th");
    cell1.innerHTML = "Coin Image";
    tblH.appendChild(cell1);
    
    

    for(let i = 0; i < flipsArr.length; i++){
        let tr = tbl.insertRow();
        
        for(let j = 0; j < 2; j++){
                let td = tr.insertCell();
                if(j===0){
                    td.appendChild(document.createTextNode(flipsArr[i])); 
                } else {
                    var image = document.createElement('img');
                    image.setAttribute("src", "/assets/img/"+flipsArr[i]+".png");
                    image.setAttribute("class", "smallcoin");
                    td.appendChild(image); 
                }
                
                
                td.style.border = '1px solid black';
            }     
    }
    body.appendChild(tbl);
}
  
// Enter number and press button to activate coin flip series
const coins = document.getElementById("coins")
			// Add event listener for coins form
			coins.addEventListener("submit", flipCoins)
			// Create the submit handler
			async function flipCoins(event) {
				event.preventDefault();
				
				const endpoint = "app/flip/coins/"
				const url = document.baseURI+endpoint

				const formEvent = event.currentTarget

				try {
					const formData = new FormData(formEvent);
					const flips = await sendFlips({ url, formData });

					console.log(flips);
                    tableCreate(flips.raw)
					document.getElementById("heads").innerHTML = "Heads: "+flips.summary.heads;
					document.getElementById("tails").innerHTML = "Tails: "+flips.summary.tails;
				} catch (error) {
					console.log(error);
				}
			}
			// Create a data sender
			async function sendFlips({ url, formData }) {
				const plainFormData = Object.fromEntries(formData.entries());
				const formDataJson = JSON.stringify(plainFormData);
				console.log(formDataJson);

				const options = {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Accept: "application/json"
					},
					body: formDataJson
				};

				const response = await fetch(url, options);
				return response.json()
			}
// Guess a flip by clicking either heads or tails button
const heads = document.getElementById("headsbutt")
const tails = document.getElementById('tailsbutt')
// Add event listener for coin button
			heads.addEventListener("click", guessCoinH)
            tails.addEventListener("click", guessCoinT)
			function guessCoinH() {
                fetch('http://localhost:3000/app/flip/call/heads', {mode: 'cors'})
  				.then(function(response) {
    			  return response.json();
  				})
				.then(function(result) {
					console.log(result);
					document.getElementById("call").innerHTML = result.call;
                    document.getElementById("flipped").innerHTML = result.flip;
                    document.getElementById("winlose").innerHTML = result.result;
					
					
				})
			}
            function guessCoinT() {
                fetch('http://localhost:3000/app/flip/call/tails', {mode: 'cors'})
  				.then(function(response) {
    			  return response.json();
  				})
				.then(function(result) {
					console.log(result);
					document.getElementById("call").innerHTML = result.call;
                    document.getElementById("callcoin").setAttribute("src", "/assets/img/"+result.call+".png");
                   
                    document.getElementById("flipped").innerHTML = result.flip;
                    document.getElementById("flipped coin").setAttribute("src", "/assets/img/"+result.flip+".png");
                  
                    document.getElementById("winlose").innerHTML = result.result;
                    
					
					
				})
			}
			