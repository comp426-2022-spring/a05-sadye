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
					
				})
			}
// Flip multiple coins and show coin images in table as well as summary results

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
const guess = document.getElementById("guess")
			// Add event listener for coins form
			guess.addEventListener("submit", guessCoin)
			// Create the submit handler
			async function guessCoin(event) {
				event.preventDefault();
				
				const endpoint = "app/flip/call/"
				const url = document.baseURI+endpoint

				const formEvent = event.currentTarget

				try {
					const formData = new FormData(formEvent);
					const call = await sendFlips({ url, formData });

					console.log(call);
					document.getElementById("call").innerHTML = "Your Guess: "+call.call;
					document.getElementById("flipped").innerHTML = "Tails: "+call.flip;
                    document.getElementById("winlose").innerHTML = "Results: "+call.results;
				} catch (error) {
					console.log(error);
				}
			}
			// Create a data sender
			