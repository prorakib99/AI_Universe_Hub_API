const dataLoad = async(dataLimit) => {
    const url = 'https://openapi.programming-hero.com/api/ai/tools';
    const res = await fetch(url);
    const data = await res.json();
    loadCard(data.data.tools, dataLimit);
}

const dataLoadById = async id => {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayModalContent(data.data);

}

const displayModalContent = data => {

    document.getElementById('card-description').innerText = data.description;
    document.getElementById('plan-1').innerText = data.pricing[0].price.substring(0, 10);
    document.getElementById('plan-2').innerText = data.pricing[1].price.substring(0, 10);
    document.getElementById('plan-3').innerText = data.pricing[2].price.substring(0, 10);

    document.getElementById('modal-img').src = data.image_link[0];

    // Accuracy data has available then showing accuracy div  
    const accuracyContent = document.getElementById('accuracy-content');
    const getAccuracy = data.accuracy.score;
    const accuracy = document.getElementById('accuracy');
    accuracy.classList.add('d-none')
    if (getAccuracy !== null) {
        accuracy.classList.remove('d-none')
        accuracyContent.innerText = getAccuracy;
    }

    document.getElementById('about-heading').innerText = data.input_output_examples[0].input;
    document.getElementById('about-description').innerText = data.input_output_examples[0].output;

    // Features data showing on UI
    const features = data.features
    const featureContainer = document.getElementById('features-container');
    featureContainer.innerText = '';

    for(const feature in features){
        const featureContent = features[feature].feature_name;
        const li = document.createElement('li');
        li.innerText = featureContent;
        featureContainer.appendChild(li);
    }

    // Integrations data showing on UI
    const integrations = data.integrations;
    const integrationsContainer = document.getElementById('integrations');
    integrationsContainer.innerText = '';

    integrations.forEach(integration => {
        const li = document.createElement('li');
        li.innerText = integration;
        integrationsContainer.appendChild(li);
    })

}


const loadCard = (cards, dataLimit) => {
    const showMore = document.getElementById('show-more');
    if(dataLimit && cards.length > 6){
        cards = cards.slice(0 , 6);
        showMore.classList.remove('d-none')
    }
    else{
        showMore.classList.add('d-none')
    }
    
    const cardContainer = document.getElementById('card-container');
    cardContainer.innerText = '';
    cards.forEach( (card, i) => {

        // Loop createElement dynamically loaded
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('col-md-6', 'col-lg-4', 'd-flex', 'align-items-stretch');
        cardDiv.innerHTML = `
            <div class="card p-4 w-100">
            <img class="img-fluid rounded-4 card-img-top card-img" src="${card.image}" alt="...">
            <div class="card-body px-0">
            <h5 class="card-title text-black fw-semibold fs-4">Features</h5>
            <ol class="feature-list-${i} list-group-numbered ps-0 d-flex flex-column gap-1 mt-3 mb-2 text-secondary">
               
            </ol>
            </div>
            <div class="card-footer border-top border-2 bg-transparent px-0 pb-0 pt-3">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex flex-column gap-3">
                    <h2 class="mb-0 fs-4 fw-semibold">${card.name}</h2>
                    <div class="d-flex align-content-center gap-2">
                        <i class="fa-solid fa-calendar-days text-secondary fa-fw fs-5"></i>
                        <p class="mb-0">${card.published_in}</p>
                    </div>
                </div>
                <button onclick="dataLoadById('${card.id}')" class="btn rounded-circle  details-btn" data-bs-toggle="modal" data-bs-target="#universe-details">
                    <img src="./assets/images/Frame.png" alt="">
                </button>
            </div>
            </div>
        </div>
        `;

        cardContainer.appendChild(cardDiv);

        // Feature list append
        const features = card.features
        const featureList = document.querySelector(`.feature-list-${i}`);
        for(const feature of features){
            const li = document.createElement('li');
            li.classList.add('list-group-item');
            li.innerText = feature;
            featureList.appendChild(li);
        }
    });

    const spinner = document.getElementById('spinner');
    spinner.classList.add('d-none');
}

document.getElementById('show-more').addEventListener('click', function(){
    dataLoad();
})


dataLoad(6);