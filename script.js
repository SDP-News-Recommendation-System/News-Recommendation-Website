const searchForm = document.querySelector('.search');
const input = document.querySelector('.input');
const newsList = document.querySelector('.news-list');

searchForm.addEventListener('submit', retrieve)

function retrieve(e){

        if(input.value==''){
                alert('Input field is empty!')
                return
        }

        newsList.innerHTML = ''
            // Preventing the default form submission behavior
        e.preventDefault()

        const apiKey = '4c1a01c57bb24da786855cca3bd3cb1c'
        let topic = input.value; 

        let url = `https://newsapi.org/v2/everything?q=${topic}&apiKey=${apiKey}`

            fetch(url).then((res)=>{ 
                return res.json();
            }).then((data)=>{
                console.log(data)
                 // Iterating through the list of articles in the API response
                data.articles.forEach(article=>{
                    // Creating DOM elements for each article
                    let li = document.createElement('li');
                    let a = document.createElement('a');
                    a.setAttribute('href', article.url);
                    a.setAttribute('target', '_blank');
                    a.textContent = article.title;
                    li.appendChild(a); // Appending the article link to the list item
                    newsList.appendChild(li); // Appending the list item to the news list
                })
            }).catch((error)=>{
                console.log(error)
            })

}