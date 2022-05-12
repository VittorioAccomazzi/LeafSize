

# Application
Leaf Size is a Web application for the measurement size of the leaves in your images. The application is specifically designed for high throughput: allow to quantify as many images as possible in the least amount of time.

The application is now live at [https://vittorioaccomazzi.github.io/LeafSize/](https://vittorioaccomazzi.github.io/LeafSize/)

<p align="center">
    <img src="src/assets/workflow.gif" />
</p>

## Workflow
The application walk you through the steps necessary for the measurement:
1.	Selection of the image layout
2.	Settings for isolating the leaves (hue and saturation thresholds)
3.	Review of the result and removal of the ones which are not accurate, and accept the rest.
4.	Download the values as excel file.

You can iterate thought these steps 2 and 3 as many times as necessary and accept a few images at the time. So, you’ll be able to accommodate for situation in which a single setting is not able to work satisfactory across all the images. [This video](https://www.youtube.com/watch?v=_5F8r_aCtMU) shows the entire workflow.

### Privacy
Your images will **not** be copied nor uploaded to a server, all the processing occurs locally on your computer inside your browser.

## Input Images
The application assumes that you acquire a large number of images with the leaf, each image shall have 1 or 4 petri dishes and the leaf must be places on the dishes.  The background (table) shall be white, and the lighting uniform. See the image below as example.

For the optimal result please acquire the images as follow:
-	Uniform illumination across the image
-	Constant white background on the images.
-	Make sure that the leaves are not touching each other.

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
