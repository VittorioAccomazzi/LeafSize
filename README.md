

# Application
Leaf Size is a Web application for the measurement size of the leaves and pathogen in your images. The application is specifically designed for high throughput: allow to quantify as many images as possible in the least amount of time.

Try it now at [https://vittorioaccomazzi.github.io/LeafSize/](https://vittorioaccomazzi.github.io/LeafSize/)

<p align="center">
    <img src="src/assets/workflow.gif" />
</p>

## Workflow
The steps that the user has to quantify leaf size and pathogen size are the following:
1.	Selection of the images layout.
1. Interactively set the settings for the identification of the leaves and patogen regions in the images as follow. At any point in time you can click on `Preview` to view how the image displayed in the page analyzed:
   1. Isolate the leaves: this is accomplished setting two sliders for `hue` and `saturation`:
      1. Reducing the hue value will _increase_ the area of the leaves.
      2. Reducing the saturation value will _descrease_ the area of the leaves.
   2. Isolate the pathogen region:
      1. click on `Select Pathogen region` and then paint on the images over the pathogen region. You don't have to be accurate, just select a large part of it, to indicate which colour in the image belong to the pathogen
      2. if in the preview you see that the area for the pathogen includes also region of the leaf, click on `Select Leaf region` and then click on the region which was erroneously included. 
3.Apply the settings to _all the image_ and review them:
   3.1. Delete the ones which are not correct (for instance the leaf is not entirely identified or the pathogen region is too small)
   3.2. Press `Accept` and finalize the images which are properly processed.
4.	Download the values of the images `Accepted`

The key is that _you can iterate steps 2 and 3 multiple times_. This will allows you to process all the imags with different settings if necessary. For each leaf there the system assumes at most 1 pathogen region.

[This video](https://www.youtube.com/watch?v=_5F8r_aCtMU) shows the entire workflow.

### Privacy
Your images will **not** be copied nor uploaded to a server, all the processing occurs locally on your computer inside your browser.

## Input Images
The application assumes that you acquire a large number of images with the leaf, each image shall have 1 or 4 petri dishes and the leaf must be places on the dishes.  The background (table) shall be white, and the lighting uniform. See the image below as example.

For the optimal result please acquire the images as follow:
-	Uniform illumination across the image
-	Constant white background on the images.
-	The leaves are not touching each other. if this happen they are considered a single leaf.

<p align="center">
    <img src="src/assets/SampleImage.jpg" width="256" />
</p>

## Output
The application will report the size of each leaf in pixels. You can calibrate the image simply placing a rule in the image, and so convert the values in squared centimeters. You will be able to review the values on the browser and download a csv file for further elaboration with excel.

# Technical
The application is written with react and leverages several new and experimental features available in Chrome :
-	[Background workers](https://www.html5rocks.com/en/tutorials/workers/basics/)
-	[File System Access API](https://web.dev/file-system-access/)
-	[Offscreen Canvas](https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas)

## Contributing
If you like to contribuite to the application, clone the repository and create a pull request.

## Testing
- In order to run the test you'll need to install [node-canvas](https://github.com/Automattic/node-canvas) which details can be found [here](https://github.com/Automattic/node-canvas/wiki/Installation:-Mac-OS-X). In short for macOS you need to run the following `brew install pkg-config cairo pango libpng jpeg giflib librsvg` otherwise the installation of `node-canvas` will fail.
- In order to dump the images during testing for visual inspection, set the enviroment variable `DUMP` to `true` and then run the test on the shell using the normal npm command (`npm run test`)

## Browser Requirements
The application API which are not part of the HTML standard (yet) and are supported on Chrome only. So it will not run in any other browser. 
