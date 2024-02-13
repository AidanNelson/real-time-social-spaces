export function getArtworkData(query) {
    return new Promise((resolve, reject) => {
      let url =
        "https://api.artic.edu/api/v1/artworks/search?q=" +
        query +
        "&query[term][is_public_domain]=true";
  
      let image_id = "47c94f35-2c05-9eb2-4c3f-6c841724a0a1";
      let imageUrl =
        "https://www.artic.edu/iiif/2/" + image_id + "/full/843,/0/default.jpg";
      console.log(imageUrl);
      fetch(url)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          let data = json.data;
          let promises = []; // Array to store promises
          for (let i = 0; i < data.length; i++) {
            let itemInfoUrl = data[i].api_link;
            // Push each fetch call's promise into the promises array
            promises.push(
              fetch(itemInfoUrl)
                .then((res) => res.json())
            );
          }
          // Wait for all promises to resolve
          Promise.all(promises)
            .then((info) => {
              // Now you have all the image URLs
              resolve(info);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }