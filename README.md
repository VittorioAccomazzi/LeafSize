

# Application
Leaf Size is a Web application for the measurement size of the leaves in your images. The application is specifically designed for high throughput: allow to quantify as many images as possible in the least amount of time.

The application is now live at [https://vittorioaccomazzi.github.io/LeafSize/](https://vittorioaccomazzi.github.io/LeafSize/)

<p align="center">
    <img src="src/assets/workflow.gif" />
</p>

## Workflow
The application walk you through the steps necessary for the measurement:
-	Selection of the image layout
-	Settings for isolating the leaves (change the hue and saturation thresholds)
-	Processing of all the images and remove the ones which are not correct, and accept the rest.
-	Review the results and download as excel file.

You can iterate thought these steps as many times as necessary and accept a few images at the time. So, you’ll be able to accommodate for situation in which a single setting is not able to work satisfactory across all the images.

### Privacy
Your images will **not** be copied nor uploaded to a server, all the processing occurs locally on your computer. 

## Input Images
The application assumes that you acquire a large number of images with the leaf, each image shall have 1 or 4 petri dishes and the leaf must be places on the dishes.  The background (table) shall be white, and the lighting uniform. See the image below as example.

For the optimal result please acquire the images as follow:
-	Uniform illumination across the image
-	Constant white background on the images.
-	Make sure that the leaves are not touching each other.

<p align="center">
    <img src="src/assets/SampleImage.jpg" width="128" />
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
