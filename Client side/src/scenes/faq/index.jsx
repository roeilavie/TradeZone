// The component of the FAQ page

import { Box } from "@mui/material";
import Header from "../../components/Header";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { tokens } from "../../theme";

const FAQ = () => {
  const colors = tokens();
  return (
    <Box m="20px">
      <Header title="FAQ" subtitle="Frequently Asked Questions Page" />

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the histogram chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the histogram chart you can investigate the global trades and
            do comparison between states. In fact, the value there is the total
            sum of the product on selected year. but you can also see all the
            total of export and import all over the years. by clicking on
            animation you can investigate treds over the years. You can select
            each year from 1990 to 2021. Notice, you can select the number of
            countries with the slider.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the bar chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the bar chart you can investigate the global trades and do
            comparison between states. In fact, the value there is the total sum
            of the product on selected year. You can select each year from 1990
            to 2021. Notice, you can select up to 10 countries and see the
            differences.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the line chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the line chart you can investigate the global trades and do
            comparison between states over the years. In fact, the value there
            is the total sum of the product and you can see the progress over
            the years. Notice, you can select up to 7 countries and see the
            differences.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the pie chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the pie chart you can investigate the global trades and do
            comparison between categories over the years. In fact, the value
            there is the precent of the products from all the products that you
            chose. You can select each year from 1990 to 2021. Notice, you can
            select up to 5 products and see the differences.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the geo chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the geo chart you can investigate the global trades and do
            comparison between countries and products over the years. In fact,
            the value there is the accurate value in USD of the products that
            you chose. You can select each year from 1990 to 2021 (you need to
            use the slider). Notice, you can select up to 3 products and see the
            differences. Also, you can click the animation button and the
            computer will show you the changes over the years.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is Louvain algorithm?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The Louvain algorithm uses a method based on optimizing a quality
            function called modularity to find communities in a network.
            Modularity measures the difference between the actual number of
            edges within communities and the expected number of edges in a
            random network with the same degree distribution.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the network chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the network chart you can create a social network and see the
            connections between states. You can change product or year and see
            how to network changes. By default, the network split to communities
            with the Louvain algorithm.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            What is Scale-free Small-world model?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            The scale-free small-world model is a network model that combines
            the characteristics of both scale-free networks and small-world
            networks. It is a mathematical model used to generate networks that
            exhibit properties commonly observed in many real-world networks,
            such as social networks, biological networks, and technological
            networks.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color={colors.greenAccent[500]} variant="h5">
            How can I use the timeline chart?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            With the network chart you can do research how much the network is
            Small-world of Scale-free or neither one of them. Also, you can see
            how the network structure changed over the years. By clicking on of
            the squars you will redirect to the network chart.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default FAQ;
